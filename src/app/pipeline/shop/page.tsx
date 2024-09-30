"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";
import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";


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
  const activeView = props.searchParams?.view ?? "workOrders";
  const [pipelineColumns, setPipelineColumns] = useState<Column[]>([]);

  const columnType = "shop";

  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType("shop");
      setPipelineColumns(columns);
    };

    fetchShopColumns();
  }, []);

  const handleColumnsUpdate = async ({ columns }: { columns: Column[] }) => {
    setPipelineColumns(columns);
  };
  const type = "Shop Pipelines";

  return (
    <div className="space-y-8">
      <Header
        activeView={activeView}
        pipelinesTitle={type}
        columns={pipelineColumns}
        onColumnsUpdate={handleColumnsUpdate}
        type={columnType}
      />
      {activeView === "pipelines" ? (
        <Pipelines
          pipelinesTitle={type}
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
