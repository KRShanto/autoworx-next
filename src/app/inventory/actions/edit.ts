"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { InventoryProductType } from "@prisma/client";
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
  type,
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
  type?: InventoryProductType;
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
      type,
    },
  });

  revalidatePath("/inventory");

  return {
    type: "success",
    data: updatedProduct,
  };
}
