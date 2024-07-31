"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteClient(id: number) {
  await db.client.delete({
    where: {
      id,
    },
  });

  revalidatePath("/client");
}
