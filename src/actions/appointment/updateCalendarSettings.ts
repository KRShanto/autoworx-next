"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

/**
 * Updates the calendar settings for a company.
 *
 * @param data - The new calendar settings.
 * @returns A promise that resolves to a ServerAction indicating the result.
 */
export async function updateCalendarSettings(data: {
  weekStart: string;
  dayStart: string;
  dayEnd: string;
  weekend1: string;
  weekend2: string;
}): Promise<ServerAction> {
  // Authenticate the user and get the session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Create or Update the calendar settings in the database
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

  // Revalidate the path to update the cache
  revalidatePath("/task");

  // Return a success action
  return { type: "success" };
}
