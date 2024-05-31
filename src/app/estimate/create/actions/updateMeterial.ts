"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function updateMeterial({
  id,
  name,
  categoryId,
  vendorId,
  tags,
  notes,
  quantity,
  cost,
  sell,
  discount,
  addToInventory,
}: {
  id: number;
  name: string;
  categoryId?: number;
  vendorId?: number;
  tags?: string;
  notes?: string;
  quantity?: number;
  cost?: number;
  sell?: number;
  discount?: number;
  addToInventory?: boolean;
}): Promise<ServerAction> {
  const updatedMaterial = await db.material.update({
    where: { id },
    data: {
      name,
      categoryId,
      vendorId,
      tags,
      notes,
      quantity,
      cost,
      sell,
      discount,
      addToInventory,
    },
  });

  return {
    type: "success",
    data: updatedMaterial,
  };
}
