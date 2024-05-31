"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function updateLabor({
  id,
  name,
  categoryId,
  tags,
  notes,
  hours,
  charge,
  discount,
  addToCannedLabor = true,
}: {
  id: number;
  name: string;
  categoryId?: number;
  tags?: string;
  notes?: string;
  hours?: number;
  charge?: number;
  discount?: number;
  addToCannedLabor?: boolean;
}): Promise<ServerAction> {
  const updatedLabor = await db.labor.update({
    where: { id },
    data: {
      name,
      categoryId,
      tags,
      notes,
      hours,
      charge,
      discount,
      addToCannedLabor,
    },
  });

  return {
    type: "success",
    data: updatedLabor,
  };
}
