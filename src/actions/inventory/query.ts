"use server";

import { db } from "@/lib/db";

/**
 * Get an inventory product by its ID.
 * @param {number | string | null} currentProductId - The ID of the product.
 * @returns {Promise<T>} The inventory product.
 */
export const getInventoryProductById = async <T>(
  currentProductId: number | string | null,
): Promise<T> => {
  try {
    // Fetch the inventory product from the database
    const inventoryProduct = await db.inventoryProduct.findUnique({
      where: {
        id: currentProductId as number,
      },
      include: {
        category: true,
        vendor: true,
      },
    });
    return JSON.parse(JSON.stringify(inventoryProduct)) as T;
  } catch (err) {
    throw err;
  }
};

/**
 * Get the history of an inventory product by its history ID.
 * @param {Object} params - The parameters for getting the history.
 * @param {number} params.inventoryProductHistoryId - The ID of the product history.
 * @returns {Promise<T>} The inventory product history.
 */
export const getInventoryProductHistory = async <T>({
  inventoryProductHistoryId,
}: {
  inventoryProductHistoryId: number;
}) => {
  try {
    // Fetch the inventory product history from the database
    const getHistory = await db.inventoryProductHistory.findUnique({
      where: { id: inventoryProductHistoryId },
    });
    return JSON.parse(JSON.stringify(getHistory)) as T;
  } catch (err) {
    throw err;
  }
};
