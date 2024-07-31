"use server";

import { ServerAction } from "@/types/action";
import { db } from "@/lib/db";

export async function updateService({
  id,
  name,
  categoryId,
  description,
}: {
  id: number;
  name: string;
  categoryId?: number;
  description?: string;
}): Promise<ServerAction> {
  const updatedService = await db.service.update({
    where: { id },
    data: {
      name,
      categoryId,
      description,
    },
  });

  return {
    type: "success",
    data: updatedService,
  };
}
