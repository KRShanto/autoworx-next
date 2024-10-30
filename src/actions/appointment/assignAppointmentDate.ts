"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import createGoogleCalendarEvent from "../task/google-calendar/createGoogleCalendarEvent";
import updateGoogleCalendarEvent from "../task/google-calendar/updateGoogleCalendarEvent";

export async function assignAppointmentDate({
  id,
  date,
  startTime,
  endTime,
}: {
  id: number;
  date: Date | string;
  startTime: string;
  endTime: string;
}): Promise<ServerAction> {
  try {
    let updatedAppointment = await db.appointment.update({
      where: {
        id,
      },
      data: {
        date: new Date(date),
        startTime,
        endTime,
      },
    });

    revalidatePath("/task");

    // if the task has date, start time and end time, then insert it in google calendar
    // also need to check if google calendar token exists or not, if not, then no need of inserting
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (
      googleCalendarToken &&
      updatedAppointment.googleEventId &&
      updatedAppointment.startTime &&
      updatedAppointment.endTime &&
      updatedAppointment.date &&
      updatedAppointment.title
    ) {
      let appointmentForGoogleCalendar = {
        title: updatedAppointment.title,
        startTime: updatedAppointment.startTime,
        endTime: updatedAppointment.endTime,
        date: new Date(updatedAppointment.date).toISOString(),
        assignedUsers: [],
      };

      await updateGoogleCalendarEvent(
        updatedAppointment.googleEventId,
        appointmentForGoogleCalendar,
      );
    } else if (
      googleCalendarToken &&
      !updatedAppointment.googleEventId &&
      updatedAppointment.startTime &&
      updatedAppointment.endTime &&
      updatedAppointment.date &&
      updatedAppointment.title
    ) {
      let appointmentForGoogleCalendar = {
        title: updatedAppointment.title,
        startTime: updatedAppointment.startTime,
        endTime: updatedAppointment.endTime,
        date: new Date(updatedAppointment.date).toISOString(),
        assignedUsers: [],
      };

      let event = await createGoogleCalendarEvent(appointmentForGoogleCalendar);

      // if event is successfully created in google calendar, then save the event id in task model
      if (event && event.id) {
        await db.appointment.update({
          where: {
            id: updatedAppointment.id,
          },
          data: {
            googleEventId: event.id,
          },
        });
      }
    }

    return {
      type: "success",
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return {
      type: "error",
    };
  }
}
