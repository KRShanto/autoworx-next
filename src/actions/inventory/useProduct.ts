"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Use a product from the inventory.
 * @param {Object} params - The parameters for using the product.
 * @param {number} params.productId - The ID of the product.
 * @param {string | null} params.invoiceId - The ID of the invoice.
 * @param {Date} params.date - The date of the usage.
 * @param {number} params.quantity - The quantity to use.
 * @param {string} params.notes - Additional notes.
 * @returns {Promise<ServerAction>} The result of the action.
 */
export async function useProduct({
  productId,
  invoiceId,
  date,
  quantity,
  notes,
}: {
  productId: number;
  invoiceId: string | null;
  date: Date;
  quantity: number;
  notes: string;
}): Promise<ServerAction> {
  const companyId = await getCompanyId();

  // Fetch the product from the database
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
    include: { vendor: true },
  });

  // Check if there is sufficient quantity in inventory
  if (product!.quantity! < quantity) {
    return {
      type: "error",
      message: "Insufficient quantity in inventory.",
    };
  }

  // Create a new history record for the product usage
  const newHistory = await db.inventoryProductHistory.create({
    data: {
      companyId,
      productId,
      invoiceId,
      date,
      quantity,
      notes,
      type: "Sale",
      price: product?.price,
      vendorId: product?.vendor?.id,
    },
  });

  // Update the product quantity in the inventory
  const newQuantity = product!.quantity! - quantity;
  await db.inventoryProduct.update({
    where: { id: productId },
    data: { quantity: newQuantity },
  });

  // Revalidate the inventory path
  revalidatePath("/inventory");

  return {
    type: "success",
    data: newHistory,
  };
}
