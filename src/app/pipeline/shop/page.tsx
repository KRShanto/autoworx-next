"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeView = searchParams.get("view") || "workOrders";

  const viewHandler = (view: string) => {
    router.push(`?view=${view}`);
  };
  const type = "Shop Pipelines";
  return (
    <div className="space-y-8">
      <Header
        onToggleView={viewHandler}
        activeView={activeView}
        pipelinesTitle={type}
      />
      {activeView === "pipelines" ? <Pipelines /> : <WorkOrders />}
    </div>
  );
};

export default Page;
