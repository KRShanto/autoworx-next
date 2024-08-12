"use client";
import React, { useState } from "react";
import Header from "./Header";
import WorkOrders from "./WorkOrders";
import Pipelines from "./components/Pipelines";

type Props = {};

const Page = (props: Props) => {
  const [view, setView] = useState("workOrders");
  const viewHandler = (view: string) => {
    setView(view);
  };
  return (
    <div className="space-y-8">
      <Header onToggleView={viewHandler} activeView={view} />
      {/*  @ts-ignore */}
      {view === "workOrders" ? <WorkOrders /> : <Pipelines />}
    </div>
  );
};

export default Page;
