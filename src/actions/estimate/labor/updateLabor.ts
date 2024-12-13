"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Updates an existing labor entry in the database.
 *
 * @param {Object} params - The parameters for updating the labor.
 * @param {number} params.id - The ID of the labor to update.
 * @param {string} params.name - The name of the labor.
 * @param {number} [params.categoryId] - The category ID of the labor.
 * @param {Tag[]} [params.tags] - The tags associated with the labor.
 * @param {string} [params.notes] - Additional notes for the labor.
 * @param {number} [params.hours] - The number of hours for the labor.
 * @param {number} [params.charge] - The charge for the labor.
 * @param {number} [params.discount] - The discount for the labor.
 * @returns {Promise<ServerAction>} The result of the update operation.
 */
export async function updateLabor({
  id,
  name,
  categoryId,
  tags,
  notes,
  hours,
  charge,
  discount,
}: {
  id: number;
  name: string;
  categoryId?: number;
  tags?: Tag[];
  notes?: string;
  hours?: number;
  charge?: number;
  discount?: number;
}): Promise<ServerAction> {
  // Update the labor entry in the database
  const updatedLabor = await db.labor.update({
    where: { id },
    data: {
      name,
      categoryId,
      notes,
      hours,
      charge,
      discount,
    },
  });

  // Delete all existing tags associated with the labor
  await db.laborTag.deleteMany({
    where: {
      laborId: id,
    },
  });

  // Create new tags for the labor if provided
  if (tags) {
    await Promise.all(
      tags.map((tag) =>
        db.laborTag.create({
          data: {
            laborId: id,
            tagId: tag.id,
          },
        }),
      ),
    );
  }

  // Retrieve the updated tags for the labor
  const updatedLaborTags = await db.laborTag.findMany({
    where: {
      laborId: id,
    },
    include: {
      tag: true,
    },
  });

  // Revalidate the cache for the estimate path
  revalidatePath("/estimate");

  // Return the result of the update operation
  return {
    type: "success",
    data: {
      ...updatedLabor,
      tags: updatedLaborTags.map((tag) => tag.tag),
    },
  };
}
