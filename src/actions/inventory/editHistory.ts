"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

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
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
  });

  const history = await db.inventoryProductHistory.findUnique({
    where: { id: historyId },
  });

  const vendor = vendorId
    ? await db.vendor.findUnique({
        where: { id: vendorId },
      })
    : null;

  // update history
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

  // update product quantity
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

  revalidatePath("/inventory");

  return {
    type: "success",
    data: newHistory,
  };
}
