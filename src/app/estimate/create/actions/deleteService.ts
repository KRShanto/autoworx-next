"use server";

import { ServerAction } from "@/types/action";
import { db } from "@/lib/db";

export async function deleteService(id: number): Promise<ServerAction> {
  await db.service.delete({
    where: { id },
  });

  return {
    type: "success",
  };
}
