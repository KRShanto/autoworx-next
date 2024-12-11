"use client";

import React, { useEffect, useState } from "react";
import ManagePipelines from "./ManagePipelines";
import { usePathname, useRouter } from "next/navigation";
import { EmployeeType } from "@prisma/client";
import SessionUserType from "@/types/sessionUserType";
interface UserTypes {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  employeeType: EmployeeType;
  companyId: number;
}
interface HeaderProps {
  activeView: string;
  pipelinesTitle: string;
  onColumnsUpdate: (data: { columns: Column[] }) => void;
  columns: Column[];
  type: string;
  currentUser: SessionUserType | undefined;

  [key: string]: any;
}
interface Column {
  id: number | null;
  title: string;
  type: string;
  order: number;
}

export default function Header({
  activeView,
  pipelinesTitle,
  onColumnsUpdate,
  columns,
  type,
  currentUser,

  ...restProps
}: Readonly<HeaderProps>) {
  const router = useRouter();
  const pathname = usePathname();

  const [isPipelineManaged, setPipelineManaged] = useState(false);

  const handleSaveColumns = (updatedColumns: Column[]) => {
    onColumnsUpdate({ columns: updatedColumns });
  };

  const onToggleView = (view: string) => {
    router.push(`?view=${view}`);
  };

  const hasManagePipelineAccess =
    currentUser?.employeeType === "Admin" ||
    currentUser?.employeeType === "Manager";

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
            {/* Work Orders */}

            {pathname.includes("/sales") ? "Leads" : "Work Orders"}
          </button>
          <button
            onClick={() => onToggleView("pipelines")}
            className={`rounded border px-4 py-2 ${activeView === "pipelines" ? "bg-[#6571FF] text-white" : "border-[#6571FF] bg-white text-[#6571FF]"}`}
          >
            Pipelines
          </button>
        </div>
      </div>

      {activeView === "pipelines" && hasManagePipelineAccess && (
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
          pipelineType={type}
        />
      )}
    </div>
  );
}
