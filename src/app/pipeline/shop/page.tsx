"use client";
import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Pipelines from "../components/Pipelines";
import WorkOrders from "../components/WorkOrders";

import { useServerGet } from "@/hooks/useServerGet";
import SessionUserType from "@/types/sessionUserType";
import { useSearchParams } from "next/navigation";
import getDataForNewAppointment from "@/actions/pipelines/getDataForNewAppointment";

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
  const initialView = searchParam.get("view") ?? "workOrders";
  const [activeView, setActiveView] = useState(initialView);
  const [pipelineColumns, setPipelineColumns] = useState<Column[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUserType>();

  const columnType = "shop";

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
        setCurrentUser(data);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const newView = searchParam.get("view") ?? "workOrders";
    setActiveView(newView);
  }, [searchParam]);

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
