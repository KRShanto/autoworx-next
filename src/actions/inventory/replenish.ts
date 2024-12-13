"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Replenish the inventory with a new product.
 * @param {Object} params - The parameters for replenishing the product.
 * @param {number} params.productId - The ID of the product.
 * @param {Date} params.date - The date of the replenishment.
 * @param {number} params.vendorId - The ID of the vendor.
 * @param {number} params.quantity - The quantity to add.
 * @param {number} params.price - The price of the product.
 * @param {string} params.unit - The unit of the product.
 * @param {string} params.lot - The lot number of the product.
 * @param {string} params.notes - Additional notes.
 * @returns {Promise<ServerAction>} The result of the action.
 */
export async function replenish({
  productId,
  date,
  vendorId,
  quantity,
  price,
  unit,
  lot,
  notes,
}: {
  productId: number;
  date: Date;
  vendorId?: number;
  quantity: number;
  price?: number;
  unit?: string;
  lot?: string;
  notes?: string;
}): Promise<ServerAction> {
  const companyId = await getCompanyId();

  // Fetch the product from the database
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
  });

  // Fetch the vendor from the database if vendorId is provided
  const vendor = vendorId
    ? await db.vendor.findUnique({
        where: { id: vendorId },
      })
    : null;

  // Create a new history record for the product replenishment
  const newHistory = await db.inventoryProductHistory.create({
    data: {
      companyId,
      productId,
      date,
      quantity,
      notes,
      type: "Purchase",
      price: price || product?.price,
      vendorId: vendor?.id,
    },
  });

  // Update the product quantity in the inventory
  const newQuantity = product!.quantity! + quantity;
  await db.inventoryProduct.update({
    where: { id: productId },
    data: {
      quantity: newQuantity,
      price: price || product?.price,
      unit: unit || product?.unit,
      lot: lot || product?.lot,
    },
  });

  // Revalidate the inventory path
  revalidatePath("/inventory");

  return {
    type: "success",
    data: newHistory,
  };
}
