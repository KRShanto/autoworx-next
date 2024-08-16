import Title from "@/components/Title";
import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { IoPieChartOutline } from "react-icons/io5";
import HorizontalPayoutCard from "./components/HorizontalPayoutCard";
import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import EmployeeFilter from "./components/EmployeeFilter";
import EmployeeTable from "./EmployeeTable";
import {
  calculatePreviousMonthEarnings,
  calculate2ndPreviousMonthEarnings,
  calculateTotalEarnings,
} from "@/lib/payout";

export default async function Page() {
  const companyId = await getCompanyId();
  const employees = await db.user.findMany({
    where: {
      companyId,
      role: "employee",
    },
    // TODO don't fetch password
  });
  const technicians = await db.technician.findMany({
    where: {
      companyId,
    },
  });

  const previousMonthEarnings = calculatePreviousMonthEarnings(
    technicians as any,
  );
  const secondPreviousMonthEarnings = calculate2ndPreviousMonthEarnings(
    technicians as any,
  );
  const totalEarnings = calculateTotalEarnings(technicians as any);

  // Calculate the percentage change with checks
  let percentageChange = "N/A";
  let increased = false;
  if (secondPreviousMonthEarnings !== 0) {
    const earningsDifference =
      previousMonthEarnings - secondPreviousMonthEarnings;
    percentageChange = (
      (earningsDifference / secondPreviousMonthEarnings) *
      100
    ).toFixed(2);
    increased = earningsDifference > 0;
  }

  return (
    <div className="h-full w-full space-y-8">
      <Title>Employee List</Title>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <HorizontalPayoutCard
            title="Monthly Payout"
            amount={previousMonthEarnings}
            percentage={`${percentageChange}%`}
            increased={increased}
          />
          <HorizontalPayoutCard title="YTD Payout" amount={totalEarnings} />
        </div>
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
