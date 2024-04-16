"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteService(id: number) {
  await db.service.delete({
    where: { id },
  });

  revalidatePath("/inventory/service");
}
