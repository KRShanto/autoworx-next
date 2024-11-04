"use server";

import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { revalidatePath } from "next/cache";

export async function clockOut({
  clockInOutId,
  clockOutTime,
}: {
  clockInOutId: number;
  clockOutTime: Date;
}) {
  try {
    const user = await getUser();
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

    let ClockBreaksLength = clockedOut?.ClockBreak?.length - 1;
    let lastClockBreakId = clockedOut.ClockBreak[ClockBreaksLength]?.id;

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

    revalidatePath("/");

    return { success: true, message: "Clocked Out", data: clockedOut };
  } catch (error) {
    return { success: false };
  }
}
