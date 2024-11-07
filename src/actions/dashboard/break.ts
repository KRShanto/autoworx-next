"use server";

import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { revalidatePath } from "next/cache";
import { getLastClockInOutForUser } from "./clockIn";

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

    return { success: true, message: "Break Successfull", data: clockedIn };
  } catch (error) {
    return { success: false };
  }
}

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
    return { success: false };
  }
}

export async function getLastClockBreakForUser() {
  const lastClockInOut = await getLastClockInOutForUser();

  if (!lastClockInOut) return null;

  if (lastClockInOut?.ClockBreak?.length > 0) {
    return lastClockInOut.ClockBreak[lastClockInOut?.ClockBreak?.length - 1];
  } else {
    return null;
  }
}
