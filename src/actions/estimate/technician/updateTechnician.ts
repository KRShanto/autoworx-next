"use server";

import { db } from "@/lib/db";
import { Priority } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { updateWorkOrderStatus } from "./updateWorkOrderStatus";
import {
  createTechnicianValidationSchema,
  updateTechnicianValidationSchema,
} from "@/validations/schemas/technicians/technician.validation";
import { ServerAction } from "@/types/action";
import { TErrorHandler } from "@/types/globalError";
import { errorHandler } from "@/error-boundary/globalErrorHandler";

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
): Promise<ServerAction | TErrorHandler> => {
  try {
    // if (!payload) {
    //   return { type: "error", message: "Invalid payload" };
    // }
    console.log({ payload });

    await updateTechnicianValidationSchema.parseAsync(payload);
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
    revalidatePath("/estimate/workorder");
    revalidatePath("/employee");
    return {
      type: "success",
      data: {
        ...updatedTechnician,
        name: user?.firstName + " " + user?.lastName,
      },
    };
  } catch (err) {
    return errorHandler(err);
  }
};
