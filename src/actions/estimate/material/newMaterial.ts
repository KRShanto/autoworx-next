"use server";

import { createProduct } from "@/actions/inventory/create";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { InventoryProduct, Material, Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Creates a new material in the database.
 *
 * @param {Object} params - The parameters for creating the material.
 * @param {string} params.name - The name of the new material.
 * @param {number} [params.categoryId] - The category ID of the new material (optional).
 * @param {number} [params.vendorId] - The vendor ID of the new material (optional).
 * @param {Tag[]} [params.tags] - The tags for the new material (optional).
 * @param {string} [params.notes] - The notes for the new material (optional).
 * @param {number} [params.quantity] - The quantity of the new material (optional).
 * @param {number} [params.cost] - The cost of the new material (optional).
 * @param {number} [params.sell] - The sell price of the new material (optional).
 * @param {number} [params.discount] - The discount on the new material (optional).
 * @param {boolean} [params.addToInventory] - Whether to add the material to inventory (optional).
 * @returns {Promise<ServerAction>} The result of the creation operation.
 */
export async function newMaterial({
  name,
  categoryId,
  vendorId,
  tags,
  notes,
  quantity,
  cost,
  sell,
  discount,
  addToInventory,
}: {
  name: string;
  categoryId?: number;
  vendorId?: number;
  tags?: Tag[];
  notes?: string;
  quantity?: number;
  cost?: number;
  sell?: number;
  discount?: number;
  addToInventory?: boolean;
}): Promise<ServerAction> {
  // Authenticate the user and get the session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  let newMaterial: Material | InventoryProduct | null = null;
  let newMaterialTags: { tag: Tag }[] = [];

  // Create the material in the inventory if specified
  if (addToInventory) {
    const res = await createProduct({
      name,
      categoryId,
      vendorId,
      description: notes,
      quantity: quantity || 1,
      price: cost || 0,
      type: "Product",
    });

    if (res.type === "error") {
      return res;
    } else {
      newMaterial = res.data;
    }
  } else {
    // Create the material in the database
    newMaterial = await db.material.create({
      data: {
        name,
        categoryId,
        vendorId,
        notes,
        quantity,
        cost,
        sell,
        discount,
        companyId,
      },
    });
  }

  // Create tags for the new material
  if (tags && newMaterial) {
    if (addToInventory) {
      await Promise.all(
        tags.map((tag) =>
          db.inventoryProductTag.create({
            data: {
              inventoryId: newMaterial.id,
              tagId: tag.id,
            },
          }),
        ),
      );

      newMaterialTags = await db.inventoryProductTag.findMany({
        where: {
          inventoryId: newMaterial?.id,
        },
        include: { tag: true },
      });
    } else {
      await Promise.all(
        tags.map((tag) =>
          db.materialTag.create({
            data: {
              materialId: newMaterial.id,
              tagId: tag.id,
            },
          }),
        ),
      );

      newMaterialTags = await db.materialTag.findMany({
        where: {
          materialId: newMaterial?.id,
        },
        include: { tag: true },
      });
    }
  }

  // Revalidate the cache for the "/estimate" path
  revalidatePath("/estimate");

  // Return the result of the creation operation
  return {
    type: "success",
    data: {
      ...newMaterial,
      tags: newMaterialTags.map((materialTag) => materialTag.tag),
    },
  };
}
