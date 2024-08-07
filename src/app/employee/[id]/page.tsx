"use client";
import React, { useEffect, useState } from "react";
import AttendancePerformance from "../components/AttendancePerformance";
import EmployeeInformation from "../components/EmployeeInformation";
import EmployeeInfoTable from "../components/EmployeeInfoTable";
import FilterComp from "../components/FilterComp";
import Header from "../components/Header";

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
