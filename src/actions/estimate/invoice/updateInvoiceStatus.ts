"use server";
import { db } from "@/lib/db";

export async function updateInvoiceStatus(invoiceId: string, newStatus: string) {
  try {
    await db.invoice.update({
      where: { id: invoiceId },
      data: { workOrderStatus: newStatus },
    });
    return { type: "success" };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { type: "error", message: "Failed to update invoice status" };
  }
}