"use server";

// Import necessary modules and types
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Deletes a status by its ID.
 *
 * @param {number} id - The ID of the status to delete.
 * @returns {Promise<ServerAction>} The result of the status deletion.
 */
export async function deleteStatus(id: number): Promise<ServerAction> {
  // Delete the status from the database
  await db.status.delete({
    where: { id },
  });

  // Return the result of the status deletion
  return {
    type: "success",
  };
}
