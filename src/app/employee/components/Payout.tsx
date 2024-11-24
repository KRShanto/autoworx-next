import {
  calculate2ndPreviousMonthEarnings,
  calculateCurrentMonthEarnings,
  calculatePreviousMonthEarnings,
  calculateTotalEarnings,
  History,
} from "@/lib/payout";
import React from "react";
import PayoutCard from "./PayoutCard";
import { EmployeeWorkInfo } from "./employeeWorkInfoType";

export default function Payout({ info }: { info: EmployeeWorkInfo }) {
  // get how much money the employee has made last month
  const previousMonthEarnings = calculatePreviousMonthEarnings(
    info as History[],
  );
  const secondPreviousMonthEarnings = calculate2ndPreviousMonthEarnings(
    info as History[],
  );
  const currentMonthEarnings = calculateCurrentMonthEarnings(info as History[]);
  const totalEarnings = calculateTotalEarnings(info as History[]);

  // Calculate the percentage change with checks
  let previousMonthPercentageChange = 0;
  let currentMonthPercentageChange = 0;
  let previousMonthIncreased = false;
  let currentMonthIncreased = false;

  if (secondPreviousMonthEarnings !== 0) {
    const earningsDifference =
      previousMonthEarnings - secondPreviousMonthEarnings;
    previousMonthPercentageChange = +(
      (earningsDifference / secondPreviousMonthEarnings) *
      100
    ).toFixed(2);
    previousMonthIncreased = earningsDifference > 0;
  }

  if (previousMonthEarnings !== 0) {
    const earningsDifference = currentMonthEarnings - previousMonthEarnings;
    currentMonthPercentageChange = +(
      (earningsDifference / previousMonthEarnings) *
      100
    ).toFixed(2);
    currentMonthIncreased = earningsDifference > 0;
  }

  return (
    <div className="flex space-x-6">
      <PayoutCard
        title="Previous Month Payout"
        amount={previousMonthEarnings}
        percentage={previousMonthPercentageChange}
        increased={previousMonthIncreased}
      />
      <PayoutCard
        title="Current Month Payout"
        amount={currentMonthEarnings}
        percentage={currentMonthPercentageChange}
        increased={currentMonthIncreased}
      />
      <PayoutCard title="YTD Payout" amount={totalEarnings} />
    </div>
  );
}
