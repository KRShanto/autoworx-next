"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function editProduct({
  id,
  name,
  description,
  price,
  categoryId,
  vendorId,
  quantity,
  unit,
  lot,
}: {
  id: number;
  name: string;
  description?: string;
  price?: number;
  categoryId?: number;
  vendorId?: number;
  quantity?: number;
  unit?: string;
  lot?: string;
}): Promise<ServerAction> {
  const updatedProduct = await db.inventoryProduct.update({
    where: { id },
    data: {
      name,
      description,
      price,
      categoryId,
      vendorId,
      quantity,
      unit,
      lot,
    },
  });

  revalidatePath("/inventory");

  return {
    type: "success",
    data: updatedProduct,
  };
}
