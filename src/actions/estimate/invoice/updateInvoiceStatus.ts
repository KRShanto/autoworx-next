"use server";
import { db } from "@/lib/db";
import { InvoiceType } from "@prisma/client";

export async function updateInvoiceStatus(
  invoiceId: string,
  newStatusId: number,
) {
  let type: InvoiceType | undefined;
  if (invoiceId) {
    const column = await db.column.findUnique({
      where: {
        id: newStatusId,
      },
    });

    if (column) {
      const currentInvoice = await db.invoice.findUnique({
        where: { id: invoiceId },
        select: { type: true },
      });

      if (column.title === "In Progress") {
        type = "Invoice";
      } else {
        if (currentInvoice?.type === "Invoice") {
          type = "Invoice";
        }
      }
    } else {
      throw new Error(
        "Column not found to create invoice conversions at pipeline stage",
      );
    }
  }
  try {
    await db.invoice.update({
      where: { id: invoiceId },
      data: { columnId: newStatusId, type: type },
    });
    return { type: "success" };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { type: "error", message: "Failed to update invoice status" };
  }
}
