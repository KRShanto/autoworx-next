"use server";

import { db } from "@/lib/db";

export const getInventoryProductById = async <T>(
  currentProductId: number | undefined,
): Promise<T> => {
  try {
    const inventoryProduct = await db.inventoryProduct.findUnique({
      where: {
        id: currentProductId,
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
