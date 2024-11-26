"use server";

import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

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
