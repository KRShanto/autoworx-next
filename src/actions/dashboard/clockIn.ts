"use server";

import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { revalidatePath } from "next/cache";

/**
 * Clock in the user and record the clock in time.
 *
 * @param clockInTime - The time the user clocked in.
 * @returns An object indicating the success or failure of the operation.
 */
export async function clockIn({ clockInTime }: { clockInTime: Date }) {
  try {
    const user = await getUser();
    const clockedIn = await db.clockInOut.create({
      data: {
        userId: user.id,
        companyId: user.companyId,
        clockIn: clockInTime,
      },
    });
    revalidatePath("/");

    return { success: true, message: "Clocked In", data: clockedIn };
  } catch (error) {
    console.error("Error clocking in:", error);
    return { success: false };
  }
}

/**
 * Get the last clock in/out record for the user.
 *
 * @returns The last clock in/out record for the user.
 */
export async function getLastClockInOutForUser() {
  const user = await getUser();
  const lastClockInOut = await db.clockInOut.findFirst({
    where: {
      userId: user.id,
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: "desc", // Replace with the appropriate timestamp field
    },
    include: {
      ClockBreak: true,
    },
    take: 1,
  });

  return lastClockInOut;
}
