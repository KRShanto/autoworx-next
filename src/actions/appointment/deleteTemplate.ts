"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function deleteTemplate(id: number): Promise<ServerAction> {
  await db.emailTemplate.delete({
    where: {
      id,
    },
  });

  return {
    type: "success",
  };
}
