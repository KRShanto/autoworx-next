"use server";

import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { revalidatePath } from "next/cache";

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
    return { success: false };
  }
}

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
