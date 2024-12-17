"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteInvoice(id: string): Promise<ServerAction> {
  await db.invoice.delete({
    where: {
      id,
    },
  });

  revalidatePath("/estimate");
  redirect("/estimate");

  return {
    type: "success",
  };
}
