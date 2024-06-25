"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { InventoryProductType } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CreateProductInput {
  name: string;
  description?: string;
  price?: number;
  categoryId?: number;
  vendorId?: number;
  quantity?: number;
  unit?: string;
  lot?: string;
  type: InventoryProductType;
}

export async function createProduct(
  data: CreateProductInput,
): Promise<ServerAction> {
  const companyId = await getCompanyId();
  const newProduct = await db.inventoryProduct.create({
    data: {
      ...data,
      companyId,
    },
  });

  revalidatePath("/inventory");

  return {
    type: "success",
    data: newProduct,
  };
}
