"use client";
import React, { useEffect, useState } from "react";
import Header from "../information/components/Header";
import EmployeeInformation from "../information/components/EmployeeInformation";
import FilterComp from "../information/components/FilterComp";
import EmployeeInfoTable from "../information/components/EmployeeInfoTable";
import AttendancePerformance from "../information/components/AttendancePerformance";

interface Employee {
  name: string;
  role: string;
}

interface EmployeeData {
  [key: string]: Employee;
}

const employeeData: EmployeeData = {
  sales: { name: "Shanto", role: "Sales" },
  technician: { name: "Noman", role: "Technician" },
};

export default function Page({ params }: { params: { id: string } }) {
  const [view, setView] = useState("details");

  const employee = employeeData[params.id] || {
    name: "Default",
    role: "Employee",
  };

  const viewHandler = (view: string) => {
    setView(view);
  };

  return (
    <>
      <Header onToggleView={viewHandler} activeView={view} />
      <EmployeeInformation role={employee.role} />

      {view === "details" ? (
        <>
          <FilterComp />
          <EmployeeInfoTable />
        </>
      ) : (
        <AttendancePerformance />
      )}
    </>
  );
}
