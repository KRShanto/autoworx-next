"use server";

import { ServerAction } from "@/types/action";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Deletes an existing service from the database.
 *
 * @param {number} id - The ID of the service to delete.
 * @returns {Promise<ServerAction>} The result of the deletion operation.
 */
export async function deleteService(id: number): Promise<ServerAction> {
  // Delete the service from the database
  await db.service.delete({
    where: { id },
  });

  // Revalidate the cache for the "/estimate" path
  revalidatePath("/estimate");

  // Return the result of the deletion operation
  return {
    type: "success",
  };
}
