import Title from "@/components/Title";
import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { IoPieChartOutline } from "react-icons/io5";
import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import EmployeeFilter from "./components/EmployeeFilter";
import EmployeeTable from "./EmployeeTable";
import TotalPayouts from "./TotalPayouts";

export default async function Page() {
  const companyId = await getCompanyId();
  const employees = await db.user.findMany({
    where: {
      companyId,
      role: "employee",
    },
    // TODO don't fetch password
  });

  return (
    <div className="h-full w-full space-y-8">
      <Title>Employee List</Title>

      <div className="flex items-center justify-between">
        <TotalPayouts />
        <div>
          <button className="flex items-center gap-x-2 rounded-md bg-slate-100 p-2 px-5 text-[#6571FF] shadow-md">
            <IoPieChartOutline />
            <span>Workforce Reporting</span>
          </button>
        </div>
      </div>

      <EmployeeFilter />

      <EmployeeTable employees={employees} />
    </div>
  );
}
