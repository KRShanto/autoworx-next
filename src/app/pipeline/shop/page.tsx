"use client"
import React, { useState } from "react";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";


const completed = Array(5).fill({
  name: "Shanto",
  email: "xyz@gmail.com",
  phone: "123456789",
});
const cancelled = Array(5).fill({ name: "", email: "", phone: "" });
const pending = Array(5).fill({ name: "", email: "", phone: "" });
const re_dos = Array(5).fill({ name: "", email: "", phone: "" });
const optional1 = Array(5).fill({ name: "", email: "", phone: "" });
const optional2 = Array(5).fill({ name: "", email: "", phone: "" });
const shopData = [
  { title: "Pending", leads: pending },
  { title: "Completed", leads: completed },
  { title: "Cancelled", leads: cancelled },
  { title: "Re-Dos", leads: re_dos },

  { title: "Optional1", leads: optional1 },
  { title: "Optional2", leads: optional2 },
];
const shopColumn = [
  { id: "1", title: "Pending" },
  { id: "2", title: "Completed" },
  { id: "3", title: "Cancelled" },
  { id: "4", title: "Re-Dos" },
  { id: "5", title: "Optional1" },
  { id: "6", title: "Optional2" },
];
type Props = {
  searchParams?: { view?: string };
};

const Page = (props: Props) => {
  const activeView = props.searchParams?.view || "workOrders";
  const [pipelineColumns, setPipelineColumns] = useState(shopColumn);
  const [shopPipelineData, setshopPipelineData] = useState(shopData);
  const handleColumnsUpdate = ({ columns, updatedPipelineData }: { columns: { id: string; title: string }[], updatedPipelineData: any[] }) => {
    setPipelineColumns(columns);
    setshopPipelineData(updatedPipelineData);
  };
  const type = "Shop Pipelines";

  return (
    <div className="space-y-8">
      <Header
        activeView={activeView}
        pipelinesTitle={type}
        columns={pipelineColumns}
        onColumnsUpdate={handleColumnsUpdate}
        pipelineData={shopPipelineData}

      />
      {activeView === "pipelines" ? (
        <Pipelines pipelinesTitle={type} pipelinesData={shopPipelineData} columns={pipelineColumns} />
      ) : (
        <WorkOrders />
      )}
    </div>
  );
};

export default Page;
