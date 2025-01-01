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

  const { service, category } = info.reduce(
    (acc, technician: any) => {
      acc.service = technician.invoice.invoiceItems.map(
        (item: any) => item.service?.name,
      );
      acc.category = technician.invoice.invoiceItems.map(
        (item: any) => item.service.category?.name,
      );
      return acc;
    },
    { service: [], category: [] },
  );

  if (activeView === "details") {
    return (
      <>
        <FilterComp service={service} category={category} />
        <EmployeeInfoTable info={info} />
      </>
    );
  }

  return <AttendancePerformance employeeType={employeeType} />;
}
