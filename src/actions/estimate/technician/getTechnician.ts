"use server";

import { db } from "@/lib/db";

/**
 * Get a technician by their ID.
 *
 * @param id - The ID of the technician to retrieve.
 * @returns A promise that resolves to the technician object.
 */
export async function getTechnician(id: number) {
  // Fetch the technician from the database based on their ID
  const technician = await db.technician.findUnique({
    where: {
      id,
    },
  });

  // Return the technician object
  return technician;
}
