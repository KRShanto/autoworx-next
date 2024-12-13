"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Deletes an existing labor entry from the database.
 *
 * @param {number} id - The ID of the labor to delete.
 * @returns {Promise<ServerAction>} The result of the deletion operation.
 */
export async function deleteLabor(id: number): Promise<ServerAction> {
  // Delete the labor entry from the database
  await db.labor.delete({
    where: { id },
  });

  // Revalidate the cache for the estimate path
  revalidatePath("/estimate");

  // Return the result of the deletion operation
  return {
    type: "success",
  };
}
