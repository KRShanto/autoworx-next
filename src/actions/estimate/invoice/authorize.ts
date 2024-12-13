"use server";

import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Authorizes an invoice by updating the authorized name.
 * @param invoiceId - The ID of the invoice to authorize.
 * @param authorizedName - The name of the person authorizing the invoice.
 * @returns A promise that resolves to a ServerAction indicating success.
 */
export async function authorizeInvoice(
  invoiceId: string,
  authorizedName: string,
) {
  const user = await getUser();
  await db.invoice.update({
    where: {
      id: invoiceId,
      userId: user.id,
    },
    data: {
      authorizedName,
    },
  });

  revalidatePath("/estimate");

  return {
    type: "success",
  };
}

/**
 * Deletes the authorization of an invoice by setting the authorized name to null.
 * @param invoiceId - The ID of the invoice to delete authorization from.
 * @returns A promise that resolves to a ServerAction indicating success.
 */
export async function deleteInvoiceAuthorize(invoiceId: string) {
  const user = await getUser();
  await db.invoice.update({
    where: {
      id: invoiceId,
      userId: user.id,
    },
    data: {
      authorizedName: null,
    },
  });

  revalidatePath("/estimate");

  return {
    type: "success",
  };
}
