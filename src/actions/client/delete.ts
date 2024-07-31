"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function deleteClient(id: number): Promise<ServerAction> {
  await db.client.delete({ where: { id } });

  revalidatePath("/client");

  return {
    type: "success",
  };
}
