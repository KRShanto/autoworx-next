"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function deleteEstimate(id: string): Promise<ServerAction> {
  await db.invoice.delete({
    where: {
      id,
    },
  });

  return {
    type: "success",
  };
}
