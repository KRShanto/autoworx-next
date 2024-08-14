"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "./Header";
import WorkOrders from "./WorkOrders";
import Pipelines from "./components/Pipelines";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeView = searchParams.get("view") || "workOrders";

  const viewHandler = (view: string) => {
    router.push(`?view=${view}`);
  };

  return (
    <div className="space-y-8">

      <Header onToggleView={viewHandler} activeView={activeView} />
      {activeView === "pipelines" ? <Pipelines /> : <WorkOrders />}

      
    </div>
  );
};

export default Page;
