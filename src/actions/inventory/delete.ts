"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Delete a product from the inventory.
 * @param {number} id - The ID of the product to delete.
 * @returns {Promise<{ type: string }>} The result of the action.
 */
export async function deleteInventory(id: number) {
  // Delete the product from the database
  await db.inventoryProduct.delete({
    where: { id },
  });

  // Revalidate the inventory path
  revalidatePath("/inventory");

  return { type: "success" };
}
