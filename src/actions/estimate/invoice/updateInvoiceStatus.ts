"use server";
import { db } from "@/lib/db";
import { InvoiceType } from "@prisma/client";

/**
 * Updates the status of an invoice.
 * @param invoiceId - The ID of the invoice to update.
 * @param newStatusId - The ID of the new status to set.
 * @returns An object indicating success or error.
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  newStatusId: number,
) {
  let type: InvoiceType | undefined;

  if (invoiceId) {
    // Find the column with the new status ID
    const column = await db.column.findUnique({
      where: {
        id: newStatusId,
      },
    });

    if (column) {
      // Get the current type of the invoice
      const currentInvoice = await db.invoice.findUnique({
        where: { id: invoiceId },
        select: { type: true },
      });

      // Determine the new type based on the column title
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
    // Update the invoice with the new status and type
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
