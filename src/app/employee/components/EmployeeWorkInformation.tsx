"use client";

import { EmployeeType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import AttendancePerformance from "./AttendancePerformance";
import EmployeeInfoTable from "./EmployeeInfoTable";
import { EmployeeWorkInfo } from "./employeeWorkInfoType";
import FilterComp from "./FilterComp";

export default function EmployeeWorkInformation({
  info,
  employeeType,
}: {
  info: EmployeeWorkInfo;
  employeeType: EmployeeType;
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

  return <AttendancePerformance employeeType={employeeType} />;
}
