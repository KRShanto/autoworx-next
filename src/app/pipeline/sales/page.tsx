"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";
import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";
import { getCompanyUser } from "@/actions/user/getCompanyUser";

import UserTypes from "@/types/userTypes";
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
  const [usersType, setUsersType] = useState<UserTypes[]>([]);

  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType("sales");
      setPipelineColumns(columns);
    };

    fetchShopColumns();
  }, []);

  useEffect(() => {
    const fetchUserTypes = async () => {
      const fetchedUsersType = await getCompanyUser();

      setUsersType(fetchedUsersType);
    };

    fetchUserTypes();
  }, []);

  console.warn(usersType);
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
        usersType={usersType}
      />

      {activeView === "pipelines" ? (
        <Pipelines
          pipelinesTitle={type}
          columns={pipelineColumns}
          usersType={usersType}
        />
      ) : (
        <WorkOrders type={columnType} />
      )}
    </div>
  );
};

export default Page;
