"use server";

import { db } from "@/lib/db";

export async function saveNotes(clientId: number, notes: string) {
  await db.client.update({
    where: { id: clientId },
    data: { notes },
  });
}
