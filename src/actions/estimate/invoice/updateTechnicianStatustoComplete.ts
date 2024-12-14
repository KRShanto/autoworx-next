"use server";

import { db } from "@/lib/db";

export const updateTechnicianStatustoComplete = async (invoiceId: string) => {
  try {
    const updatedTechnician = await db.technician.updateMany({
      where: { invoiceId: invoiceId },
      data: { status: "Complete" },
    });
    return updatedTechnician;
  } catch (error) {
    console.error("Error updating technician status to complete:", error);
  }
};
