"use client";

import React, { useState } from "react";
import ManagePipelines from "./ManagePipelines";
import { useRouter } from "next/navigation";

interface HeaderProps {
  activeView: string;
  // onToggleView: (view: string) => void;
  pipelinesTitle:string;
  [key:string]:any;
}



export default function Header({ 
  activeView,
  //  onToggleView ,
   pipelinesTitle,
   ...restProps

}: HeaderProps) {
  const router = useRouter();
  const{salesColumn,shopColumn}=restProps;
  const initialColumns= pipelinesTitle==="Sales Pipelines"?salesColumn:shopColumn;

const [isPipelineManaged, setPipelineManaged] = useState(false);
  const [columns, setColumns] = useState(initialColumns || []);
 const handleSaveColumns = (updatedColumns:{id:string,name:string}[]) => {
    setColumns(updatedColumns);
  };

  const onToggleView = (view: string) => {
    router.push(`?view=${view}`);
  };

  return (
    <div className="flex items-center justify-between p-4" {...restProps}>
      <div className="flex items-center">
        <h1 className="mr-4 text-2xl font-bold text-[#66738C]">
          {pipelinesTitle}
        </h1>
        <div className="flex">
          <button
            onClick={() => onToggleView("workOrders")}
            className={`mr-2 rounded border px-4 py-2 ${activeView === "workOrders" ? "bg-[#6571FF] text-white" : "border-[#6571FF] bg-white text-[#6571FF]"}`}
          >
            Work Orders
          </button>
          <button
            onClick={() => onToggleView("pipelines")}
            className={`rounded border px-4 py-2 ${activeView === "pipelines" ? "bg-[#6571FF] text-white" : "border-[#6571FF] bg-white text-[#6571FF]"}`}
          >
            Pipelines
          </button>
        </div>
      </div>

    
      {activeView === "pipelines" && (
        <div>
          <button
            onClick={() => {
              setPipelineManaged(true);
            }}
            className={`text-white" rounded border bg-[#6571FF] px-4 py-2 text-white`}
          >
            Manage Pipelines
          </button>
        </div>
      )}

      {isPipelineManaged && (
        <ManagePipelines
          columns={columns}
          onSave={handleSaveColumns}
          onClose={() => setPipelineManaged(false)}
        />
      )}
    </div>
  );
}
