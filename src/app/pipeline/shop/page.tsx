import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";

type Props = {
  searchParams?: { view?: string };
};

const Page = (props: Props) => {
  const activeView = props.searchParams?.view || "workOrders";
  const type = "Shop Pipelines";

  return (
    <div className="space-y-8">
      <Header activeView={activeView} pipelinesTitle={type} />
      {activeView === "pipelines" ? <Pipelines /> : <WorkOrders />}
    </div>
  );
};

export default Page;
