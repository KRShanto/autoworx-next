"use server";

import { ServerAction } from "@/types/action";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteService(id: number): Promise<ServerAction> {
  await db.service.delete({
    where: { id },
  });

  revalidatePath("/estimate");

  return {
    type: "success",
  };
}
