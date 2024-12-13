"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Creates redo entries for technicians and updates their status.
 *
 * @param {Object[]} redoTechnicians - The list of technicians to create redo entries for.
 * @param {string} redoTechnicians[].invoiceId - The invoice ID associated with the redo.
 * @param {number} redoTechnicians[].serviceId - The service ID associated with the redo.
 * @param {number} redoTechnicians[].technicianId - The technician ID to update.
 * @param {string} redoTechnicians[].notes - Additional notes for the redo.
 * @returns {Promise<Object>} The result of the operation.
 */
export const createInvoiceRedo = async (
  redoTechnicians: {
    invoiceId: string;
    serviceId: number;
    technicianId: number;
    notes: string;
  }[],
) => {
  try {
    // Create redo entries and update technician status in a transaction
    await Promise.all(
      redoTechnicians.map(async (technicianInfo) => {
        await db.$transaction(async (prisma) => {
          // Create a new redo entry for the technician
          await prisma.invoiceRedo.create({
            data: {
              invoiceId: technicianInfo.invoiceId,
              serviceId: technicianInfo.serviceId,
              technicianId: technicianInfo.technicianId,
              notes: technicianInfo.notes,
            },
          });
          // Update the status of the technician
          await prisma.technician.update({
            where: {
              id: technicianInfo.technicianId,
            },
            data: {
              status: "In Progress",
            },
          });
        });
      }),
    );
    // Revalidate the cache for the workorder path
    revalidatePath("/estimate/workorder");
    return {
      status: 200,
      data: null,
    };
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
