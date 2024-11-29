"use server";

import { db } from "@/lib/db";

export default async function getHoliday(
  companyId: number,
  selectedMonth: string,
  year: number,
) {
  try {
    const holidays = await db.holiday.findMany({
      where: { companyId, month: selectedMonth, year: year },
    });
    return holidays;
  } catch (err: any) {
    throw new Error("Failed to fetch holidays: ", err);
  }
}
