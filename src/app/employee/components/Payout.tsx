import React from "react";
import PayoutCard from "./PayoutCard";
import { EmployeeWorkInfo } from "./employeeWorkInfoType";
import {
  calculateCurrentMonthEarnings,
  calculatePreviousMonthEarnings,
  calculateTotalEarnings,
  History,
} from "@/lib/payout";

export default function Payout({ info }: { info: EmployeeWorkInfo }) {
  // get how much money the employee has made last month
  const previousMonthEarnings = calculatePreviousMonthEarnings(
    info as History[],
  );
  const currentMonthEarnings = calculateCurrentMonthEarnings(info as History[]);
  const totalEarnings = calculateTotalEarnings(info as History[]);

  return (
    <div className="flex space-x-6">
      <PayoutCard
        title="Previous Month Payout"
        amount={previousMonthEarnings}
        percentage="100%"
      />
      <PayoutCard
        title="Current Month Payout"
        amount={currentMonthEarnings}
        percentage="90%"
      />
      <PayoutCard title="YTD Payout" amount={totalEarnings} percentage="85%" />
    </div>
  );
}
