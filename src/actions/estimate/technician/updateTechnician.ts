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

export const updateTechnician = async (
  technicianId: number,
  payload: TechnicianInput,
) => {
  try {
    if (!payload) {
      return { type: "error", message: "Invalid payload" };
    }

    const updatedTechnician = await db.technician.update({
      where: { id: technicianId },
      data: {
        ...payload,
        dateClosed: payload.status === "Complete" ? new Date() : null,
      },
    });

    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });

    await updateWorkOrderStatus(payload.invoiceId);
    revalidatePath("/estimate/workorder");
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
