"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";
import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";

// Sample data
const newLeads = [{ name: "Al Noman", email: "noman@me.com", phone: "123456" }];
const leadsGenerated = Array(5).fill({
  name: "ali nur",
  email: "xyz@gmail.com",
  phone: "123456789",
});
const followUp = Array(5).fill({ name: "", email: "", phone: "" });
const estimatesCreated = Array(5).fill({ name: "", email: "", phone: "" });
const archived = Array(5).fill({ name: "", email: "", phone: "" });
const converted = Array(5).fill({ name: "", email: "", phone: "" });

const salesData = [
  { title: "New Leads", leads: newLeads },
  { title: "Leads Generated", leads: leadsGenerated },
  { title: "Follow-up", leads: followUp },
  { title: "Estimates Created", leads: estimatesCreated },
  { title: "Archived", leads: archived },
  { title: "Converted", leads: converted },
];

type Props = {
  searchParams?: { view?: string };
};

interface Lead {
  name: string;
  email: string;
  phone: string;
}

interface PipelineData {
  title: string;
  leads: Lead[];
}

interface Column {
  id: number;
  title: string;
  type: string;
}
const Page = (props: Props) => {
  const activeView = props.searchParams?.view || "workOrders";
  const columnType = "sales";

  const [pipelineColumns, setPipelineColumns] = useState<Column[]>([]);
  const [salesPipelineData, setSalesPipelineData] =
    useState<PipelineData[]>(salesData);

  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType("sales");
      setPipelineColumns(columns);
    };

    fetchShopColumns();
  }, []);
  const handleColumnsUpdate = ({
    columns,
    updatedPipelineData,
  }: {
    columns: Column[];
    updatedPipelineData: PipelineData[];
  }) => {
    setPipelineColumns(columns);
    setSalesPipelineData(updatedPipelineData);
  };
  const type = "Sales Pipelines";

  return (
    <div className="space-y-8">
      <Header
        activeView={activeView}
        pipelinesTitle={type}
        columns={pipelineColumns}
        onColumnsUpdate={handleColumnsUpdate}
        pipelineData={salesPipelineData}
        type={columnType}
      />

      {activeView === "pipelines" ? (
        <Pipelines
          pipelinesTitle={type}
          columns={pipelineColumns}
          pipelinesData={salesPipelineData}
          type={columnType}
        />
      ) : (
        <WorkOrders type={columnType} />
      )}
    </div>
  );
};

export default Page;
