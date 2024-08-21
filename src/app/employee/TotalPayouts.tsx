import React from "react";
import HorizontalPayoutCard from "./components/HorizontalPayoutCard";
import {
  calculatePreviousMonthEarnings,
  calculate2ndPreviousMonthEarnings,
  calculateTotalEarnings,
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
    <div className="flex items-center gap-x-8">
      <HorizontalPayoutCard
        title="Monthly Payout"
        amount={previousMonthEarnings}
        percentage={`${percentageChange}%`}
        increased={increased}
      />
      <HorizontalPayoutCard title="YTD Payout" amount={totalEarnings} />
    </div>
  );
}
