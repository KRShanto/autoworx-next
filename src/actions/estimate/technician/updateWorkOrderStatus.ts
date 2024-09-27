"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Update the status of a work order
 * 1. First get the invoice from the given `id`
 * 2. Get all the technicians for that invoice
 * 3. Check the technician statuses
 * If all the technicians are complete, update the work order status to complete
 * If all the technicians are "Pending", update the work order status to pending
 * If any of the technicians are not complete, update the work order status to in progress
 * 4. Update the work order status
 */

export async function updateWorkOrderStatus(id: string): Promise<ServerAction> {
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      technician: true,
    },
  });

  const technicians = invoice?.technician;

  if (!technicians) {
    // No need to update the status if there are no technicians
    return { type: "success", message: "No technicians found" };
  }

  const allComplete = technicians.every(
    (technician) => technician.status === "Complete",
  );
  const allPending = technicians.every(
    (technician) => technician.status === "Pending",
  );

  let status = "In Progress";
  if (allComplete) {
    status = "Complete";
  } else if (allPending) {
    status = "Pending";
  }

  await db.invoice.update({
    where: { id },
    data: {
      workOrderStatus: status,
    },
  });

  return { type: "success", message: "Work order status updated" };
}
