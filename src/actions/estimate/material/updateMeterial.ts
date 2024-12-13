"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";

/**
 * Updates an existing material in the database.
 *
 * @param {Object} params - The parameters for updating the material.
 * @param {number} params.id - The ID of the material to update.
 * @param {string} params.name - The new name of the material.
 * @param {number} [params.categoryId] - The new category ID of the material (optional).
 * @param {number} [params.vendorId] - The new vendor ID of the material (optional).
 * @param {Tag[]} [params.tags] - The new tags for the material (optional).
 * @param {string} [params.notes] - The new notes for the material (optional).
 * @param {number} [params.quantity] - The new quantity of the material (optional).
 * @param {number} [params.cost] - The new cost of the material (optional).
 * @param {number} [params.sell] - The new sell price of the material (optional).
 * @param {number} [params.discount] - The new discount on the material (optional).
 * @returns {Promise<ServerAction>} The result of the update operation.
 */
export async function updateMeterial({
  id,
  name,
  categoryId,
  vendorId,
  tags,
  notes,
  quantity,
  cost,
  sell,
  discount,
}: {
  id: number;
  name: string;
  categoryId?: number;
  vendorId?: number;
  tags?: Tag[];
  notes?: string;
  quantity?: number;
  cost?: number;
  sell?: number;
  discount?: number;
}): Promise<ServerAction> {
  // Update the material in the database
  const updatedMaterial = await db.material.update({
    where: { id },
    data: {
      name,
      categoryId,
      vendorId,
      notes,
      quantity,
      cost,
      sell,
      discount,
    },
  });

  // Delete all existing tags for the material
  await db.materialTag.deleteMany({
    where: {
      materialId: id,
    },
  });

  // Create new tags for the material
  if (tags) {
    await Promise.all(
      tags.map((tag) =>
        db.materialTag.create({
          data: {
            materialId: id,
            tagId: tag.id,
          },
        }),
      ),
    );
  }

  // Retrieve the updated tags for the material
  const updatedMaterialTags = await db.materialTag.findMany({
    where: {
      materialId: id,
    },
    include: { tag: true },
  });

  // Return the result of the update operation
  return {
    type: "success",
    data: {
      ...updatedMaterial,
      tags: updatedMaterialTags.map((materialTag) => materialTag.tag),
    },
  };
}
