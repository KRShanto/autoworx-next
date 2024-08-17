

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";

type Props = {
  searchParams?: { view?: string };
};

const newLeads = [{ name: "Al Noman", email: "noman@me.com", phone: "123456" }];

const leadsGenerated = Array(5).fill({
  name: "ali nur",
  email: "xyz@gmail.com",
  phone: "123456789",
});
const followUp = Array(5).fill({ name: "", email: "", phone: "" });
const estimatesCreated = Array(5).fill({ name: "", email: "", phone: "" });
const archived = Array(5).fill({ name: "", email: "", phone: "" });
const converted = Array(5).fill({ name: "", email: "", phone: "" });

const salesData = [
  { title: "New Leads", leads: newLeads },
  { title: "Leads Generated", leads: leadsGenerated },
  { title: "Follow-up", leads: followUp },
  { title: "Estimates Created", leads: estimatesCreated },
  { title: "Archived", leads: archived },
  { title: "Converted", leads: converted },
];

const salesColumn=[
  {id:"1",name:"New Leads"},
  {id:"2",name:"Leads Generated"},
  {id:"3",name:"Follow-up"},
  {id:"4",name:"Estimates Created"},
  {id:"5",name:"Archived"},
  {id:"6",name:"Converted"},
]
const Page = (props: Props) => {
  const activeView = props.searchParams?.view || "workOrders";

  
  const type = "Sales Pipelines";
  return (
    <div className="space-y-8">
      <Header
        
        activeView={activeView}
        pipelinesTitle={type} salesColumn={salesColumn }
      />
      {activeView === "pipelines" ? <Pipelines pipelinesTitle={type} salesData={salesData }/> : <WorkOrders />}
    </div>
  );
};

export default Page;
