"use server";

import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { revalidatePath } from "next/cache";

/**
 * Clock out the user and update the clock out time.
 *
 * @param clockInOutId - The ID of the clock in/out record.
 * @param clockOutTime - The time the user clocked out.
 * @returns An object indicating the success or failure of the operation.
 */
export async function clockOut({
  clockInOutId,
  clockOutTime,
}: {
  clockInOutId: number;
  clockOutTime: Date;
}) {
  try {
    // Get the current user
    const user = await getUser();

    // Update the clock out time for the user
    const clockedOut = await db.clockInOut.update({
      where: {
        id: clockInOutId,
        userId: user.id,
        companyId: user.companyId,
      },
      data: {
        clockOut: clockOutTime,
      },
      include: {
        ClockBreak: true,
      },
    });

    // Get the last clock break ID
    let ClockBreaksLength = clockedOut?.ClockBreak?.length - 1;
    let lastClockBreakId = clockedOut.ClockBreak[ClockBreaksLength]?.id;

    // If the last clock break has not ended, update the break end time
    if (
      clockedOut?.ClockBreak[ClockBreaksLength]?.id &&
      !clockedOut.ClockBreak[clockedOut?.ClockBreak?.length - 1]?.breakEnd
    ) {
      await db.clockBreak.update({
        where: {
          id: lastClockBreakId,
        },
        data: {
          breakEnd: new Date(),
        },
      });
    }

    // Revalidate the path to update the cache
    revalidatePath("/");

    // Return success response
    return { success: true, message: "Clocked Out", data: clockedOut };
  } catch (error) {
    // Log the error and return failure response
    console.error("Error clocking out:", error);
    return { success: false };
  }
}
