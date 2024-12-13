"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Priority } from "@prisma/client";
import { updateWorkOrderStatus } from "./updateWorkOrderStatus";
import { revalidatePath } from "next/cache";
import moment from "moment";

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
 * Add a new technician and update the work order status.
 *
 * @param payload - The technician data to be added.
 * @returns A promise that resolves to a ServerAction indicating success or failure.
 */
export async function addTechnician(
  payload: TechnicianInput,
): Promise<ServerAction> {
  const companyId = await getCompanyId();

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

    console.log("Date with time: ", dateWithTime);

    // Create a new technician in the database
    const newTechnician = await db.technician.create({
      data: {
        ...payload,
        date: dateWithTime,
        companyId,
        dateClosed: payload.status === "Complete" ? new Date() : null,
      },
    });

    // Fetch the user associated with the new technician
    const user = await db.user.findUnique({
      where: { id: newTechnician.userId },
    });

    // Update the work order status after adding the technician
    await updateWorkOrderStatus(payload.invoiceId);
    revalidatePath("/estimate/workorder");
    revalidatePath("/estimate/view");
    revalidatePath("/employee");

    // Return a success message with the new technician data
    return {
      type: "success",
      data: { ...newTechnician, name: user?.firstName + " " + user?.lastName },
    };
  } catch (error) {
    throw error;
  }
}
