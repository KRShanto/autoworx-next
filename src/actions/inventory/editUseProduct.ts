"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Edit the usage of a product in the inventory.
 * @param {Object} params - The parameters for editing the product usage.
 * @param {number} params.productId - The ID of the product.
 * @param {string | null} params.invoiceId - The ID of the invoice.
 * @param {number} params.quantity - The quantity to use.
 * @param {string} params.notes - Additional notes.
 * @param {number} params.inventoryProductHistoryId - The ID of the product history.
 * @returns {Promise<ServerAction>} The result of the action.
 */
export async function editUseProduct({
  productId,
  invoiceId,
  quantity,
  notes,
  inventoryProductHistoryId,
}: {
  productId: number;
  invoiceId: string | null;
  quantity: number;
  notes: string;
  inventoryProductHistoryId: number;
}): Promise<ServerAction> {
  // Fetch the product from the database
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
    include: { vendor: true },
  });

  // Fetch the existing history record
  const getHistory = await db.inventoryProductHistory.findUnique({
    where: { id: inventoryProductHistoryId },
  });

  // Update the history record with new data
  const updateHistory = await db.inventoryProductHistory.update({
    where: { id: inventoryProductHistoryId },
    data: {
      invoiceId,
      quantity,
      notes,
    },
  });

  // Calculate the new quantity for the product
  const newQuantity = product!.quantity! + getHistory?.quantity! - quantity;
  await db.inventoryProduct.update({
    where: { id: productId },
    data: { quantity: newQuantity },
  });

  // Revalidate the inventory path
  revalidatePath("/inventory");

  return {
    type: "success",
    data: updateHistory,
  };
}
