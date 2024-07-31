"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function convertInvoice(id: string): Promise<ServerAction> {
  const invoice = await db.invoice.findUnique({ where: { id } });

  if (!invoice) {
    return { type: "error", message: "Invoice not found" };
  }

  await db.invoice.update({
    where: { id },
    data: {
      type: invoice.type === "Estimate" ? "Invoice" : "Estimate",
    },
  });

  revalidatePath("/estimate");

  return { type: "success", message: "Invoice converted" };
}
