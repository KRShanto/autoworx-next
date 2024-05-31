"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function deleteLabor(id: number): Promise<ServerAction> {
  await db.labor.delete({
    where: { id },
  });

  return {
    type: "success",
  };
}
