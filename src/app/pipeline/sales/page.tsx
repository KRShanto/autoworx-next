"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";

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

interface Lead{
  name: string;
  email: string;
  phone: string;
}

interface PipelineData{
  title: string;
  leads: Lead[];
}

interface Column{
  id: string;
  title: string;
}
const Page = (props: Props) => {
 
  const activeView = props.searchParams?.view|| "workOrders";

  const salesColumns=[
    { id: "1", title: "New Leads" },
    { id: "2", title: "Leads Generated" },
    { id: "3", title: "Follow-up" },
    { id: "4", title: "Estimates Created" },
    { id: "5", title: "Archived" },
    { id: "6", title: "Converted" },
  ];

  const [pipelineColumns, setPipelineColumns] = useState<Column[]>(salesColumns);
  const [salesPipelineData, setSalesPipelineData] = useState<PipelineData[]>(salesData);

  const handleColumnsUpdate = ({ columns, updatedPipelineData }: { columns: Column[], updatedPipelineData: PipelineData[] }) => {
    setPipelineColumns(columns);
    setSalesPipelineData(updatedPipelineData);
  };
  const type = "Sales Pipelines";
  console.log("data on parent page after added or deleted managed pipeline",salesPipelineData);
  console.log("columns updated after managed pipeline on parent page",pipelineColumns);
  return (
    <div className="space-y-8">
      <Header
        activeView={activeView}
        pipelinesTitle={type}
        columns={pipelineColumns}
        onColumnsUpdate={handleColumnsUpdate}
        pipelineData={salesPipelineData}
      />
      
      {activeView === "pipelines" ? (
        <Pipelines pipelinesTitle={type} columns={pipelineColumns} pipelinesData={salesPipelineData} />
      ) : (
        <WorkOrders />
      )}
    </div>
  );
};

export default Page;
