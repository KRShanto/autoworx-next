"use server";
import { db } from "@/lib/db";

export async function getCalenderSettings(companyId: number) {
  try {
    const calendarSettings = await db.calendarSettings.findUnique({
      where: { companyId },
    });
    return calendarSettings;
  } catch (err: any) {
    throw new Error("Error: ", err);
  }
}
