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
  try {
    // Authenticate the user and get the session
    const session = (await auth()) as AuthSession;
    const { companyId } = session.user;

    // Create or Update the calendar settings in the database
    await db.calendarSettings.upsert({
      where: { companyId },
      update: { ...data },
      create: { companyId, ...data },
    });

    // Revalidate the path to update the cache
    revalidatePath("/task");

    return { type: "success" };
  } catch (error) {
    console.error("Error updating calendar settings:", error);
    return { type: "error", message: "Failed to update calendar settings." };
  }
}
