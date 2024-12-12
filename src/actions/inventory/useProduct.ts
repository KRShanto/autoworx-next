"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

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
  // update product quantity
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
    include: { vendor: true },
  });

  if (product!.quantity! < quantity) {
    return {
      type: "error",
      message: "Insufficient quantity in inventory.",
    };
  }

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
