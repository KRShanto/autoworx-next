"use server";
import { db } from "@/lib/db";

type THolidays = {
  year: number;
  month: string;
  companyId: number;
  date: string;
};
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
    await db.holiday.deleteMany({
      where: {
        date: {
          notIn: holidaysFromDB.map((holiday) => holiday.date as string),
        },
        month: selectedMonth,
        year: selectedYear,
      },
    });
    return {
      status: 200,
      success: true,
      data: holidaysFromDB,
    };
  } catch (err: any) {
    throw new Error("Failed to create holiday: ", err);
  }
}
