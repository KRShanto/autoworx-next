"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Edit the history of a product in the inventory.
 * @param {Object} params - The parameters for editing the product history.
 * @param {number} params.historyId - The ID of the product history.
 * @param {number} params.productId - The ID of the product.
 * @param {Date} params.date - The date of the history.
 * @param {number} params.vendorId - The ID of the vendor.
 * @param {number} params.quantity - The quantity of the product.
 * @param {number} params.price - The price of the product.
 * @param {string} params.unit - The unit of the product.
 * @param {string} params.lot - The lot number of the product.
 * @param {string} params.notes - Additional notes.
 * @returns {Promise<ServerAction>} The result of the action.
 */
export async function editHistory({
  historyId,
  productId,
  date,
  vendorId,
  quantity,
  price,
  unit,
  lot,
  notes,
}: {
  historyId: number;
  productId: number;
  date?: Date;
  vendorId?: number;
  quantity: number;
  price?: number;
  unit?: string;
  lot?: string;
  notes?: string;
}): Promise<ServerAction> {
  // Fetch the product from the database
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
  });

  // Fetch the existing history record
  const history = await db.inventoryProductHistory.findUnique({
    where: { id: historyId },
  });

  // Fetch the vendor from the database if vendorId is provided
  const vendor = vendorId
    ? await db.vendor.findUnique({
        where: { id: vendorId },
      })
    : null;

  // Update the history record with new data
  const newHistory = await db.inventoryProductHistory.update({
    where: { id: historyId },
    data: {
      date: date || history?.date,
      quantity: quantity || history?.quantity,
      notes: notes || history?.notes,
      price: price || history?.price,
      vendorId: vendor ? vendor.id : history?.vendorId,
    },
  });

  // Calculate the new quantity for the product
  const newQuantity = product!.quantity! + quantity - history!.quantity!;
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
