import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import WorkOrders from "../components/WorkOrders";
import Pipelines from "../components/Pipelines";


const completed = Array(5).fill({
  name: "Shanto",
  email: "xyz@gmail.com",
  phone: "123456789",
});
const cancelled = Array(5).fill({ name: "", email: "", phone: "" });
const pending = Array(5).fill({ name: "", email: "", phone: "" });
const re_dos = Array(5).fill({ name: "", email: "", phone: "" });
const optional1 = Array(5).fill({ name: "", email: "", phone: "" });
const optional2 = Array(5).fill({ name: "", email: "", phone: "" });
const shopData = [
  { title: "Pending", leads: pending },
  { title: "Completed", leads: completed },
  { title: "Cancelled", leads: cancelled },
  { title: "Re-Dos", leads: re_dos },
  
  { title: "Optional1", leads: optional1 },
  { title: "Optional2", leads: optional2 },
];
const shopColumn=[
  {id:"1",name:"Pending"},
  {id:"2",name:"Completed"},
  {id:"3",name:"Cancelled"},
  {id:"4",name:"Re-Dos"},
  {id:"5",name:"Optional1"},
  {id:"6",name:"Optional2"},
]
type Props = {
  searchParams?: { view?: string };
};

const Page = (props: Props) => {
  const activeView = props.searchParams?.view || "workOrders";
  const type = "Shop Pipelines";;
  return (
    <div className="space-y-8">
      <Header
        
        activeView={activeView}
        pipelinesTitle={type}
        shopColumn={shopColumn}
      />
      {activeView === "pipelines" ? (
        <Pipelines pipelinesTitle={type} shopData={shopData} />
      ) : (
        <WorkOrders />
      )}
    </div>
  );
};

export default Page;
