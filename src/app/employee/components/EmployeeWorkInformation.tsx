"use client";

import { useSearchParams } from "next/navigation";
import FilterComp from "./FilterComp";
import EmployeeInfoTable from "./EmployeeInfoTable";
import AttendancePerformance from "./AttendancePerformance";
import { Client, Invoice, Technician, Vehicle } from "@prisma/client";
import { EmployeeWorkInfo } from "./employeeWorkInfoType";

export default function EmployeeWorkInformation({
  info,
}: {
  info: EmployeeWorkInfo;
}) {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "details";

  if (activeView === "details") {
    return (
      <>
        <FilterComp />
        <EmployeeInfoTable info={info} />
      </>
    );
  }

  return <AttendancePerformance />;
}
