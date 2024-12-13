"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { updateWorkOrderStatus } from "./updateWorkOrderStatus";
import { revalidatePath } from "next/cache";

/**
 * Delete a technician and update the work order status.
 *
 * @param params - An object containing the technician ID and invoice ID.
 * @returns A promise that resolves to a ServerAction indicating success or failure.
 */
export async function deleteTechnician({
  id,
  invoiceId,
}: {
  id: number;
  invoiceId: string;
}): Promise<ServerAction> {
  try {
    // Check if the technician exists in the invoiceRedo table
    const isExistInvoiceRedo = await db.invoiceRedo.findFirst({
      where: {
        invoiceId,
        technicianId: id,
      },
    });

    // If the technician exists in the invoiceRedo table, delete the entry
    if (isExistInvoiceRedo) {
      await db.invoiceRedo.delete({
        where: {
          id: isExistInvoiceRedo.id,
        },
      });
    }

    // Delete the technician from the database
    await db.technician.delete({
      where: {
        id,
        invoiceId,
      },
    });

    // Update the work order status after deleting the technician
    await updateWorkOrderStatus(invoiceId);
    revalidatePath("/estimate/view");

    // Return a success message
    return { type: "success" };
  } catch (err) {
    // Return an error message if the deletion fails
    return {
      type: "error",
      message: "Failed to delete technician",
    };
  }
}
