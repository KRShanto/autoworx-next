"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Deletes a client from the database based on the provided ID.
 *
 * @param id - The unique identifier of the client to delete.
 * @returns A promise that resolves to a ServerAction indicating the result.
 */
export async function deleteClient(id: number): Promise<ServerAction> {
  // Delete the client from the database
  await db.client.delete({ where: { id } });

  // Revalidate the path to update the cache
  revalidatePath("/client");

  // Return a success action
  return {
    type: "success",
  };
}
