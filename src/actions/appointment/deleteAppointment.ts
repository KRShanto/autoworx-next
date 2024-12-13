"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import deleteGoogleCalendarEvent from "../task/google-calendar/deleteGoogleCalendarEvent";

/**
 * Deletes an appointment from the database based on the provided ID.
 * Also deletes the corresponding Google Calendar event if it exists.
 *
 * @param id - The unique identifier of the appointment to delete.
 * @returns An object of type ServerAction indicating the result of the operation.
 */
export async function deleteAppointment(id: number): Promise<ServerAction> {
  try {
    // Delete the appointment from the database
    const deletedAppointment = await db.appointment.delete({
      where: {
        id,
      },
    });

    // Revalidate the path to update the cache
    revalidatePath("/task");

    // Delete the corresponding Google Calendar event if it exists
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (googleCalendarToken && deletedAppointment.googleEventId) {
      await deleteGoogleCalendarEvent(deletedAppointment.googleEventId);
    }

    // Return a success action
    return {
      type: "success",
    };
  } catch (error) {
    console.log("🚀 ~ deleteAppointment ~ error:", error);
    // Return an error action
    return {
      type: "error",
    };
  }
}
