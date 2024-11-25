"use server";

import { db } from "@/lib/db";
import { Priority, Technician } from "@prisma/client";
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

export const updateTechnician = async (
  technicianId: number,
  payload: TechnicianInput,
) => {
  try {
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

    const updatedTechnician = await db.technician.update({
      where: { id: technicianId },
      data: {
        ...payload,
        date: dateWithTime,
        dateClosed: payload.status === "Complete" ? new Date() : null,
      },
    });

    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });

    await updateWorkOrderStatus(payload.invoiceId);

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
