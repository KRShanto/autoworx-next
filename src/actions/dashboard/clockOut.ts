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
    });
    revalidatePath("/");

    return { success: true, message: "Clocked Out", data: clockedOut };
  } catch (error) {
    return { success: false };
  }
}
