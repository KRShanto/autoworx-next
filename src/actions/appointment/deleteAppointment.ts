"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import deleteGoogleCalendarEvent from "../task/google-calendar/deleteGoogleCalendarEvent";

export async function deleteAppointment(id: number): Promise<ServerAction> {
  try {
    const deletedAppointment = await db.appointment.delete({
      where: {
        id,
      },
    });

    revalidatePath("/task");

    // delete task from google calendar

    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (googleCalendarToken && deletedAppointment.googleEventId) {
      await deleteGoogleCalendarEvent(deletedAppointment.googleEventId);
    }

    return {
      type: "success",
    };
  } catch (error) {
    console.log("🚀 ~ deleteAppointment ~ error:", error);
    return {
      type: "error",
    };
  }
}
