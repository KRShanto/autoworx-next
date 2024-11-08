"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";
import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";
import { getCompanyUser } from "@/actions/user/getCompanyUser";

import SessionUserType from "@/types/sessionUserType";
import { useSearchParams } from "next/navigation";

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
  const searchParam=useSearchParams();
  const activeView =searchParam.get('view') ?? "workOrders";
  const [pipelineColumns, setPipelineColumns] = useState<Column[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUserType>();

  const columnType = "shop";

  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType("shop");
      setPipelineColumns(columns);
    };

    fetchShopColumns();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/getUser");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    };
    fetchUser();
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
