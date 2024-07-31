"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";

export async function deleteTag(id: number): Promise<ServerAction> {
  await db.tag.delete({
    where: {
      id,
    },
  });

  return {
    type: "success",
  };
}
