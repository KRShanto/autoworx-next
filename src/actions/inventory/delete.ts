"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteInventory(id: number) {
  await db.inventoryProduct.delete({
    where: { id },
  });

  revalidatePath("/inventory");

  return { type: "success" };
}
