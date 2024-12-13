"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Updates the due date of an invoice.
 * @param id - The ID of the invoice to update.
 * @param dueDate - The new due date to set.
 * @returns A promise that resolves to a ServerAction indicating success or error.
 */
export async function updateDueDate(
  id: string,
  dueDate: string,
): Promise<ServerAction> {
  try {
    // Update the invoice with the new due date
    await db.invoice.update({
      where: {
        id,
      },
      data: {
        dueDate,
      },
    });

    // Revalidate the cache for the specified path
    revalidatePath("/estimate/workorder");

    return {
      type: "success",
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
