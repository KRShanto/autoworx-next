"use client";
import React, { useState } from "react";
import Header from "./Header";
import WorkOrders from "./WorkOrders";

type Props = {};

const Page = (props: Props) => {
  const [view, setView] = useState("workOrders");
  const viewHandler = (view: string) => {
    setView(view);
  };
  return (
    <div className="space-y-8">
      <Header onToggleView={viewHandler} activeView={view} />
      {view === "workOrders" ? <WorkOrders /> : null}
    </div>
  );
};

export default Page;
