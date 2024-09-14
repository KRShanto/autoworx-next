"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function deleteLabor(id: number): Promise<ServerAction> {
  await db.labor.delete({
    where: { id },
  });

  revalidatePath("/estimate");

  return {
    type: "success",
  };
}
