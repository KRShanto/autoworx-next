"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

export async function updateCalendarSettings(data: {
  weekStart: string;
  dayStart: string;
  dayEnd: string;
  weekend1: string;
  weekend2: string;
}): Promise<ServerAction> {
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
      weekend1: data.weekend1,
      weekend2: data.weekend2,
    },
    create: {
      companyId,
      weekStart: data.weekStart,
      dayStart: data.dayStart,
      dayEnd: data.dayEnd,
      weekend1: data.weekend1,
      weekend2: data.weekend2,
    },
  });

  revalidatePath("/task");

  return { type: "success" };
}
