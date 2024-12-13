"use server";

import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { revalidatePath } from "next/cache";
import { getLastClockInOutForUser } from "./clockIn";

/**
 * Record the start of a break for the user.
 *
 * @param clockInOutId - The ID of the clock in/out record.
 * @param breakStart - The time the break started.
 * @returns An object indicating the success or failure of the operation.
 */
export async function takeBreak({
  clockInOutId,
  breakStart,
}: {
  clockInOutId: number;
  breakStart: Date;
}) {
  try {
    await getUser();
    const clockedIn = await db.clockBreak.create({
      data: {
        clockInOutId,
        breakStart,
      },
    });
    revalidatePath("/");

    return { success: true, message: "Break Successful", data: clockedIn };
  } catch (error) {
    console.error("Error starting break:", error);
    return { success: false };
  }
}

/**
 * Record the end of a break for the user.
 *
 * @param clockBreakId - The ID of the clock break record.
 * @param breakEnd - The time the break ended.
 * @returns An object indicating the success or failure of the operation.
 */
export async function stopBreak({
  clockBreakId,
  breakEnd,
}: {
  clockBreakId: number;
  breakEnd: Date;
}) {
  try {
    await getUser();
    const breakStop = await db.clockBreak.update({
      where: {
        id: clockBreakId,
      },
      data: {
        breakEnd,
      },
    });
    revalidatePath("/");
    return { success: true, message: "Stopped Break", data: breakStop };
  } catch (error) {
    console.error("Error stopping break:", error);
    return { success: false };
  }
}

/**
 * Get the last clock break record for the user.
 *
 * @returns The last clock break record for the user, or null if none exists.
 */
export async function getLastClockBreakForUser() {
  const lastClockInOut = await getLastClockInOutForUser();

  if (!lastClockInOut) return null;

  if (lastClockInOut?.ClockBreak?.length > 0) {
    return lastClockInOut.ClockBreak[lastClockInOut?.ClockBreak?.length - 1];
  } else {
    return null;
  }
}
