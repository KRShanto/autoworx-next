"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function deleteStatus(id: number): Promise<ServerAction> {
  await db.status.delete({
    where: { id },
  });

  return {
    type: "success",
  };
}
