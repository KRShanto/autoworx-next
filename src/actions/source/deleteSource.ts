"use server";

// Import necessary modules and types
import { Source } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * Deletes a source by its ID.
 *
 * @param {number} id - The ID of the source to delete.
 * @returns {Promise<Source>} The result of the source deletion.
 */
export async function deleteSource(id: number) {
  // Delete the source from the database
  return db.source.delete({
    where: { id },
  });
}
