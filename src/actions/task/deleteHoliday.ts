"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteHoliday(holidayId: number) {
  try {
    const holiday = await db.holiday.delete({
      where: {
        id: holidayId,
      },
    });
    revalidatePath("/task/month");
    return {
      status: 200,
      data: holiday,
    };
  } catch (err: any) {
    throw new Error("Failed to delete holiday: ", err);
  }
}
