"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { updateWorkOrderStatus } from "./updateWorkOrderStatus";
import { revalidatePath } from "next/cache";

export async function deleteTechnician({
  id,
  invoiceId,
}: {
  id: number;
  invoiceId: string;
}): Promise<ServerAction> {
  try {
    const isExistInvoiceRedo = await db.invoiceRedo.findFirst({
      where: {
        invoiceId,
        technicianId: id,
      },
    });
    if (isExistInvoiceRedo) {
      await db.invoiceRedo.delete({
        where: {
          id: isExistInvoiceRedo.id,
        },
      });
    }
    await db.technician.delete({
      where: {
        id,
        invoiceId,
      },
    });

    await updateWorkOrderStatus(invoiceId);
    revalidatePath("/estimate/view");

    return { type: "success" };
  } catch (err) {
    return {
      type: "error",
      message: "Failed to delete technician",
    };
  }
}
