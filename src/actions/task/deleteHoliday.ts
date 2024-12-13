"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Deletes a holiday by its ID.
 *
 * @param holidayId - The ID of the holiday to delete.
 * @returns The deleted holiday data.
 */
export async function deleteHoliday(holidayId: number) {
  try {
    // Delete the holiday from the database
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
    // Handle errors
    throw new Error("Failed to delete holiday: ", err);
  }
}
