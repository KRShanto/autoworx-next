"use client";

import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";
import { useEffect, useState } from "react";
import Header from "../components/Header";

import { getLeads } from "@/actions/pipelines/getLeads";
import SessionUserType from "@/types/sessionUserType";
import { useRouter, useSearchParams } from "next/navigation";

import { SalesLead, SalesPipelineData } from "@/types/invoiceLead";
import { Lead } from "@prisma/client";
import Leads from "../components/Leads";
import SalesPipeline from "../components/SalesPipeline";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const columnType = "sales";

  const initialView = searchParams.get("view") || "workOrders";
  const [activeView, setActiveView] = useState(initialView);
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

  const handleViewChange = (view: string) => {
    setActiveView(view);
    router.replace(`?view=${view}`);
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
        onViewChange={handleViewChange}
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
