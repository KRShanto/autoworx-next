"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Deletes an existing material from the database.
 *
 * @param {number} id - The ID of the material to delete.
 * @returns {Promise<ServerAction>} The result of the deletion operation.
 */
export async function deleteMaterial(id: number): Promise<ServerAction> {
  // Delete the material from the database
  await db.material.delete({
    where: { id },
  });

  // Return the result of the deletion operation
  return {
    type: "success",
  };
}
