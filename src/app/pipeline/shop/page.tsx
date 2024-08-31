"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";
import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";

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

type Props = {
  searchParams?: { view?: string };
};

type Column = {
  id: number;
  title: string;
  type: string;
};

const Page = (props: Props) => {
  const activeView = props.searchParams?.view || "workOrders";
  const [pipelineColumns, setPipelineColumns] = useState<Column[]>([]);
  const [shopPipelineData, setshopPipelineData] = useState(shopData);
  const columnType = "shop";
  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType("shop");
      setPipelineColumns(columns);
    };

    fetchShopColumns();
  }, []);
  // console.log(JSON.stringify(pipelineColumns, null, 2));
  const handleColumnsUpdate = async ({
    columns,
    updatedPipelineData,
  }: {
    columns: Column[];
    updatedPipelineData: any[];
  }) => {
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
        type={columnType}
      />
      {activeView === "pipelines" ? (
        <Pipelines
          pipelinesTitle={type}
          pipelinesData={shopPipelineData}
          columns={pipelineColumns}
          type={columnType}
        />
      ) : (
        <WorkOrders type={columnType} />
      )}
    </div>
  );
};

export default Page;
