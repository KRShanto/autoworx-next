"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function deleteMaterial(id: number): Promise<ServerAction> {
  await db.material.delete({
    where: { id },
  });

  return {
    type: "success",
  };
}
