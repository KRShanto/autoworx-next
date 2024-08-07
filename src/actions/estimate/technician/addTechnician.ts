"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Priority } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

export async function addTechnician(
  payload: TechnicianInput,
): Promise<ServerAction> {
  try {
    if (!payload) {
      return { type: "error", message: "Invalid payload" };
    }

    const newTechnician = await db.technician.create({
      data: {
        ...payload,
        dateClosed: payload.status === "Complete" ? new Date() : null,
      },
    });

    const user = await db.user.findUnique({
      where: { id: newTechnician.userId },
    });

    return {
      type: "success",
      data: { ...newTechnician, name: user?.firstName + " " + user?.lastName },
    };
  } catch (error) {
    throw error;
  }
}
