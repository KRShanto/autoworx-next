import Title from "@/components/Title";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { IoPieChartOutline } from "react-icons/io5";
import EmployeeFilter from "./components/EmployeeFilter";
import EmployeeTable from "./EmployeeTable";
import TotalPayouts from "./TotalPayouts";

export default async function Page() {
  const companyId = await getCompanyId();
  const employees = await db.user.findMany({
    where: {
      companyId,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      joinDate: true,
      createdAt: true,
      employeeType: true,
      phone: true,
      commission: true,
      address: true,
      city: true,
      state: true,
      zip: true,
      companyName: true,
      image: true,
    },
  });

  return (
    <div className="h-full w-full space-y-8 px-2">
      <Title>Employee List</Title>

      <div className="flex flex-wrap items-center justify-between gap-y-8">
        <TotalPayouts />
        <div>
          {/* /reporting/workforce */}
          <Link
            href="/reporting/workforce"
            className="flex items-center gap-x-2 rounded-md bg-slate-100 p-2 px-5 text-[#6571FF] shadow-md"
          >
            <IoPieChartOutline />
            <span>Workforce Reporting</span>
          </Link>
        </div>
      </div>

      <EmployeeFilter />

      <EmployeeTable employees={employees as any} />
    </div>
  );
}
