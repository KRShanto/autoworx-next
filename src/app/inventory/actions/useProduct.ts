"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function useProduct({
  productId,
  date,
  quantity,
  notes,
}: {
  productId: number;
  date: Date;
  quantity: number;
  notes: string;
}): Promise<ServerAction> {
  // update product quantity
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
    include: { vendor: true },
  });

  const newHistory = await db.inventoryProductHistory.create({
    data: {
      productId,
      date,
      quantity,
      notes,
      type: "Sale",
      price: product?.price,
      vendorName: product?.vendor?.name,
    },
  });

  const newQuantity = product!.quantity! - quantity;

  await db.inventoryProduct.update({
    where: { id: productId },
    data: { quantity: newQuantity },
  });

  revalidatePath("/inventory");

  return {
    type: "success",
    data: newHistory,
  };
}
