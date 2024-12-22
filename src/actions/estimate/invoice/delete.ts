"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

/**
 * Deletes an invoice by its ID.
 * @param id - The ID of the invoice to delete.
 * @returns A promise that resolves to a ServerAction indicating success.
 */
export async function deleteInvoice(id: string): Promise<ServerAction> {
  // Delete the invoice from the database
  await db.invoice.delete({
    where: {
      id,
    },
  });

  // Revalidate the cache for the specified path
  revalidatePath("/estimate");

  return {
    type: "success",
  };
}
