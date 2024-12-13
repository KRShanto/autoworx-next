"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Update the status of a work order based on the statuses of its technicians.
 *
 * @param id - The ID of the invoice to update.
 * @returns A promise that resolves to a ServerAction indicating success or failure.
 */
export async function updateWorkOrderStatus(id: string): Promise<ServerAction> {
  // Fetch the invoice and its associated technicians from the database
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      technician: true,
    },
  });

  // Get the list of technicians from the invoice
  const technicians = invoice?.technician;

  // If there are no technicians, return a success message without updating the status
  if (!technicians) {
    return { type: "success", message: "No technicians found" };
  }

  // Check if all technicians have the status "Complete"
  const allComplete = technicians.every(
    (technician) => technician.status === "Complete",
  );

  // Check if all technicians have the status "Pending"
  const allPending = technicians.every(
    (technician) => technician.status === "Pending",
  );

  // Determine the new status of the work order based on the technicians' statuses
  let status = "In Progress";
  if (allComplete) {
    status = "Complete";
  } else if (allPending) {
    status = "Pending";
  }

  // Update the work order status in the database
  await db.invoice.update({
    where: { id },
    data: {
      workOrderStatus: status,
    },
  });

  // Return a success message indicating the status was updated
  return { type: "success", message: "Work order status updated" };
}
