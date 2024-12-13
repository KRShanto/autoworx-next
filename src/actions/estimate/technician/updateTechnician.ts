"use server";

import { db } from "@/lib/db";
import { Priority } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { updateWorkOrderStatus } from "./updateWorkOrderStatus";

type TechnicianInput = {
  date: Date;
  due: Date;
  amount: number;
  priority: Priority;
  status: string;
  note: string;
  userId: number;
  serviceId: number;
  invoiceId: string;
};

/**
 * Update an existing technician and update the work order status.
 *
 * @param technicianId - The ID of the technician to update.
 * @param payload - The technician data to be updated.
 * @returns A promise that resolves to a ServerAction indicating success or failure.
 */
export const updateTechnician = async (
  technicianId: number,
  payload: TechnicianInput,
) => {
  try {
    // Validate the payload
    if (!payload) {
      return { type: "error", message: "Invalid payload" };
    }

    // Ensure the date includes both date and time
    const dateWithTime = new Date(payload.date);
    const currentTime = new Date();
    dateWithTime.setHours(
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds(),
      currentTime.getMilliseconds(),
    );

    // Update the technician in the database
    const updatedTechnician = await db.technician.update({
      where: { id: technicianId },
      data: {
        ...payload,
        date: dateWithTime,
        dateClosed: payload.status === "Complete" ? new Date() : null,
      },
    });

    // Fetch the user associated with the updated technician
    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });

    // Update the work order status after updating the technician
    await updateWorkOrderStatus(payload.invoiceId);
    revalidatePath("/estimate/workorder");
    revalidatePath("/employee");

    // Return a success message with the updated technician data
    return {
      type: "success",
      data: {
        ...updatedTechnician,
        name: user?.firstName + " " + user?.lastName,
      },
    };
  } catch (err) {
    throw err;
  }
};
