"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function deleteTechnician(id: number): Promise<ServerAction> {
  await db.technician.delete({
    where: {
      id,
    },
  });

  return { type: "success" };
}
