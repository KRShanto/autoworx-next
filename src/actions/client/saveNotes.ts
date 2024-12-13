"use server";

import { db } from "@/lib/db";

/**
 * Saves notes for a client in the database.
 *
 * @param clientId - The ID of the client.
 * @param notes - The notes to save.
 */
export async function saveNotes(clientId: number, notes: string) {
  // Update the client's notes in the database
  await db.client.update({
    where: { id: clientId },
    data: { notes },
  });
}
