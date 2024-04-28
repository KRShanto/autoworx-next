"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

export async function updateCalendarSettings(data: {
  weekStart: string;
  dayStart: string;
  dayEnd: string;
  // TODO: show weekends
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Create or Update the calendar settings
  const newCalendarSettings = await db.calendarSettings.upsert({
    where: {
      companyId,
    },
    update: {
      weekStart: data.weekStart,
      dayStart: data.dayStart,
      dayEnd: data.dayEnd,
    },
    create: {
      companyId,
      weekStart: data.weekStart,
      dayStart: data.dayStart,
      dayEnd: data.dayEnd,
      weekends: ["Saturday", "Sunday"],
    },
  });

  revalidatePath("/task");

  return { message: "Calendar settings updated" };
}
