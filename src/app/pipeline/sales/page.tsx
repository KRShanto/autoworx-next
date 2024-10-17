"use client";

import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Pipelines from "../components/Pipelines";
import WorkOrders from "../components/WorkOrders";

import SessionUserType from "@/types/sessionUserType";
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
  const columnType = "sales";

  const [pipelineColumns, setPipelineColumns] = useState<Column[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUserType>();

  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType("sales");
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

  // console.warn(usersType);
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
        <Pipelines pipelinesTitle={type} columns={pipelineColumns} />
      ) : (
        <WorkOrders type={columnType} />
      )}
    </div>
  );
};

export default Page;
