import React from "react";
import HorizontalPayoutCard from "./components/HorizontalPayoutCard";
import {
  calculatePreviousMonthEarnings,
  calculate2ndPreviousMonthEarnings,
  calculateTotalEarnings,
  calculateCurrentMonthEarnings,
} from "@/lib/payout";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

export default async function TotalPayouts() {
  const companyId = await getCompanyId();
  const technicians = await db.technician.findMany({
    where: {
      companyId,
    },
  });

  const currentMonthEarnings = calculateCurrentMonthEarnings(
    technicians as any,
  );
  const previousMonthEarnings = calculatePreviousMonthEarnings(
    technicians as any,
  );
  const totalEarnings = calculateTotalEarnings(technicians as any);

  // Calculate the percentage change with checks
  let percentageChange = "N/A";
  let increased = false;
  if (previousMonthEarnings !== 0) {
    const earningsDifference = currentMonthEarnings - previousMonthEarnings;
    percentageChange = (
      (earningsDifference / previousMonthEarnings) *
      100
    ).toFixed(2);
    increased = earningsDifference > 0;
  }

  return (
    <div className="flex items-center gap-x-8">
      <HorizontalPayoutCard
        title="Monthly Payout"
        amount={currentMonthEarnings}
        percentage={`${percentageChange}%`}
        increased={increased}
      />
      <HorizontalPayoutCard title="YTD Payout" amount={totalEarnings} />
    </div>
  );
}
