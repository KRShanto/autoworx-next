"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Fetch all work orders for the authenticated user's company.
 * @returns A list of work orders (invoices).
 */
export async function getWorkOrders() {
  const companyId = await getCompanyId();
  const invoices = await db.invoice.findMany({
    where: {
      companyId,
    },
    include: {
      client: true,
      vehicle: true,
      invoiceItems: {
        include: {
          service: {
            include: {
              Technician: true,
            },
          },
        },
      },
      tags: {
        select: {
          id: true,
          tag: true,
        },
      },
      tasks: true,
      assignedTo: true,
      column: true,
    },
  });

  return invoices;
}

/**
 * Update the user assigned to an invoice.
 * @param invoiceId - The ID of the invoice.
 * @param userId - The ID of the user to assign.
 * @returns An object indicating success.
 */
export const updateAssignedTo = async (invoiceId: string, userId: number) => {
  try {
    await db.invoice.update({
      where: { id: invoiceId },
      data: {
        assignedToId: userId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating assignedTo:", error);
    throw new Error("Error updating assignedTo: " + error);
  }
};
