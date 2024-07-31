"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteClientFunction(id: number) {
  await db.client.delete({ where: { id } });

  revalidatePath("/client");

  return {
    type: "success",
  };
}
