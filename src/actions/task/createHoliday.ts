"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type THolidays = {
  year: number;
  month: string;
  companyId: number;
  date: string;
};

/**
 * Creates holidays for a given company, month, and year.
 *
 * @param holidays - The list of holidays to create.
 * @param selectedMonth - The selected month.
 * @param selectedYear - The selected year.
 * @returns The created holidays.
 */
export async function createHoliday(
  holidays: THolidays[],
  selectedMonth: string,
  selectedYear: number,
) {
  try {
    const holidaysFromDB = await Promise.all(
      holidays.map(async (holiday) => {
        const findExistingHoliday = await db.holiday.findFirst({
          where: {
            companyId: holiday.companyId,
            date: holiday.date,
            month: selectedMonth,
            year: selectedYear,
          },
        });
        if (!findExistingHoliday) {
          const savedHoliday = await db.holiday.create({
            data: holiday,
          });
          return {
            month: savedHoliday.month,
            date: savedHoliday.date,
            companyId: savedHoliday.companyId,
            year: savedHoliday.year,
          };
        }
        return holiday;
      }),
    );

    // Delete holidays that are not in the provided list
    await db.holiday.deleteMany({
      where: {
        date: {
          notIn: holidaysFromDB.map((holiday) => holiday.date as string),
        },
        month: selectedMonth,
        year: selectedYear,
      },
    });

    revalidatePath("/task/month");
    return {
      status: 200,
      success: true,
      data: holidaysFromDB,
    };
  } catch (err: any) {
    // Handle errors
    throw new Error("Failed to create holiday: ", err);
  }
}
