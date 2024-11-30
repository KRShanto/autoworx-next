"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

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
  // update product quantity
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
    include: { vendor: true },
  });

  const getHistory = await db.inventoryProductHistory.findUnique({
    where: { id: inventoryProductHistoryId },
  });

  const updateHistory = await db.inventoryProductHistory.update({
    where: { id: inventoryProductHistoryId },
    data: {
      invoiceId,
      quantity,
      notes,
    },
  });

  const newQuantity = product!.quantity! + getHistory?.quantity! - quantity;

  await db.inventoryProduct.update({
    where: { id: productId },
    data: { quantity: newQuantity },
  });

  revalidatePath("/inventory");

  return {
    type: "success",
    data: updateHistory,
  };
}
