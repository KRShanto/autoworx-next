"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ServerAction } from "@/types/action";

/**
 * Edits an existing client in the database.
 *
 * @param data - The new client data.
 * @returns A promise that resolves to a ServerAction indicating the result.
 */
export async function editClient(data: {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  customerCompany?: string;
  tagId?: number;
  photo?: string;
  sourceId?: number;
}): Promise<ServerAction> {
  // Update the client in the database
  await db.client.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
      photo: data.photo ? data.photo : undefined,
    },
  });

  // Revalidate the path to update the cache
  revalidatePath("/client");

  // Return a success action
  return { type: "success" };
}
