"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { InventoryProductType } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Edit a product in the inventory.
 * @param {Object} params - The parameters for editing the product.
 * @param {number} params.id - The ID of the product.
 * @param {string} params.name - The name of the product.
 * @param {string} params.description - The description of the product.
 * @param {number} params.price - The price of the product.
 * @param {number} params.categoryId - The ID of the category.
 * @param {number} params.vendorId - The ID of the vendor.
 * @param {number} params.quantity - The quantity of the product.
 * @param {string} params.unit - The unit of the product.
 * @param {string} params.lot - The lot number of the product.
 * @param {InventoryProductType} params.type - The type of the product.
 * @param {string} params.receipt - The receipt of the product.
 * @param {number} params.lowInventoryAlert - The low inventory alert threshold.
 * @returns {Promise<ServerAction>} The result of the action.
 */
export async function editProduct({
  id,
  name,
  description,
  price,
  categoryId,
  vendorId,
  quantity,
  unit,
  lot,
  type,
  receipt,
  lowInventoryAlert,
}: {
  id: number;
  name: string;
  description?: string;
  price?: number;
  categoryId?: number;
  vendorId?: number;
  quantity?: number;
  unit?: string;
  lot?: string;
  type?: InventoryProductType;
  receipt?: string;
  lowInventoryAlert?: number;
}): Promise<ServerAction> {
  // Update the product in the database
  const updatedProduct = await db.inventoryProduct.update({
    where: { id },
    data: {
      name,
      description,
      price,
      categoryId,
      vendorId,
      quantity,
      unit,
      lot,
      type,
      receipt,
      lowInventoryAlert,
    },
  });

  // Revalidate the inventory path
  revalidatePath("/inventory");

  return {
    type: "success",
    data: updatedProduct,
  };
}
