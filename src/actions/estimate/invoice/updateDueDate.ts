"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function updateDueDate(
  id: string,
  dueDate: string,
): Promise<ServerAction> {
  try {
    await db.invoice.update({
      where: {
        id,
      },
      data: {
        dueDate,
      },
    });

    revalidatePath("/estimate/workorder");

    return {
      type: "success",
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
