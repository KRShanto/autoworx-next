"use server";

import { db } from "@/lib/db";

/**
 * Fetches holidays for a given company, month, and year.
 *
 * @param companyId - The ID of the company.
 * @param selectedMonth - The selected month.
 * @param year - The selected year.
 * @returns A list of holidays.
 */
export default async function getHoliday(
  companyId: number,
  selectedMonth: string,
  year: number,
) {
  try {
    // Fetch holidays from the database
    const holidays = await db.holiday.findMany({
      where: { companyId, month: selectedMonth, year: year },
    });
    return holidays;
  } catch (err: any) {
    // Handle errors
    throw new Error("Failed to fetch holidays: ", err);
  }
}
