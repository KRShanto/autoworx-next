"use server";

import { db } from "@/lib/db";

export const getInventoryProductById = async <T>(
  currentProductId: number | string | null,
): Promise<T> => {
  try {
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

export const getInventoryProductHistory = async <T>({
  inventoryProductHistoryId,
}: {
  inventoryProductHistoryId: number;
}) => {
  try {
    const getHistory = await db.inventoryProductHistory.findUnique({
      where: { id: inventoryProductHistoryId },
    });
    return JSON.parse(JSON.stringify(getHistory)) as T;
  } catch (err) {
    throw err;
  }
};
