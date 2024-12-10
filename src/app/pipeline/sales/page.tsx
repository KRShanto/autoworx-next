"use client";

import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Pipelines from "../components/Pipelines";
import WorkOrders from "../components/WorkOrders";

import SessionUserType from "@/types/sessionUserType";
import { useSearchParams } from "next/navigation";
import { getCompanyId } from "@/lib/companyId";
import { getLeads } from "@/actions/pipelines/getLeads";

import { Lead } from "@prisma/client";
import { SalesPipelineData, SalesLead } from "@/types/invoiceLead";
import SalesPipeline from "../components/SalesPipeline";
import Leads from "../components/Leads";
type Props = {
  searchParams?: { view?: string };
};

interface Column {
  id: number | null;
  title: string;
  type: string;
  order: number;
}

const Page = (props: Props) => {
  const searchParam = useSearchParams();
  const activeView = searchParam.get("view") ?? "workOrders";
  const columnType = "sales";

  const [pipelineColumns, setPipelineColumns] = useState<Column[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUserType>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pipelineData, setPipelineData] = useState<SalesPipelineData[]>([]);

  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType(columnType);
      setPipelineColumns(columns);
    };

    fetchShopColumns();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/getUser");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCurrentUser(data);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      const responseLead = await getLeads();
      setLeads(responseLead);
    };

    fetchLeads(); // initial fetch

    const intervalId = setInterval(fetchLeads, 3000);

    return () => clearInterval(intervalId);
  }, []);
  // console.warn(usersType);
  console.log("leads", leads);

  useEffect(() => {
    if (leads && pipelineColumns) {
      const transformedLeads: SalesLead[] = leads.map((lead) => ({
        leadId: lead.id,
        name: lead.clientName ?? "".trim(),
        email: lead.clientEmail ?? "",
        phone: lead.clientPhone ?? "",
        vehicle: lead.vehicleInfo ?? "".trim(),
        services: lead.services,
        source: lead.source,
        comments: lead.comments,
        createdAt: new Date(lead.createdAt).toDateString(),
        companyId: lead.companyId,
      }));

      const updatedPipelineData = pipelineColumns.map((column) => ({
        id: column.id,
        title: column.title,
        leads: column.title === "New Leads" ? transformedLeads : [],
      }));

      setPipelineData(updatedPipelineData);
    }
  }, [leads, pipelineColumns]);
  const handleColumnsUpdate = async ({ columns }: { columns: Column[] }) => {
    setPipelineColumns(columns);
  };
  const type = "Sales Pipelines";

  return (
    <div className="space-y-8">
      <Header
        activeView={activeView}
        pipelinesTitle={type}
        columns={pipelineColumns}
        onColumnsUpdate={handleColumnsUpdate}
        type={columnType}
        currentUser={currentUser}
      />

      {activeView === "pipelines" ? (
        <SalesPipeline
          pipelinesTitle={type}
          salesPipelineDataProp={pipelineData}
        />
      ) : (
        <Leads type={columnType} />
      )}
    </div>
  );
};

export default Page;
