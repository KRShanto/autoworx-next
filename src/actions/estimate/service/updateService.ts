"use server";

import { ServerAction } from "@/types/action";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Updates an existing service in the database.
 *
 * @param {Object} params - The parameters for updating the service.
 * @param {number} params.id - The ID of the service to update.
 * @param {string} params.name - The new name of the service.
 * @param {number} [params.categoryId] - The new category ID of the service (optional).
 * @param {string} [params.description] - The new description of the service (optional).
 * @returns {Promise<ServerAction>} The result of the update operation.
 */
export async function updateService({
  id,
  name,
  categoryId,
  description,
}: {
  id: number;
  name: string;
  categoryId?: number;
  description?: string;
}): Promise<ServerAction> {
  // Update the service in the database
  const updatedService = await db.service.update({
    where: { id },
    data: {
      name,
      categoryId,
      description,
    },
  });

  // Revalidate the cache for the "/estimate" path
  revalidatePath("/estimate");

  // Return the result of the update operation
  return {
    type: "success",
    data: updatedService,
  };
}
