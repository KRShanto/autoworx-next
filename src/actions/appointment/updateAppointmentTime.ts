"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type TAppointment = {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
};
export async function updateAppointments(appointments: TAppointment) {
  try {
    await db.appointment.update({
      where: {
        id: appointments.id,
      },
      data: {
        date: new Date(appointments?.date).toISOString(),
        startTime: appointments.startTime,
        endTime: appointments.endTime,
      },
    });
    revalidatePath("/task");
    return {
      type: "success",
    };
  } catch (err) {
    throw new Error("Failed to update appointments");
  }
}
