"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import createGoogleCalendarEvent from "../task/google-calendar/createGoogleCalendarEvent";
import updateGoogleCalendarEvent from "../task/google-calendar/updateGoogleCalendarEvent";

export interface AppointmentToUpdate {
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  assignedUsers: number[];
  clientId?: number;
  vehicleId?: number;
  draftEstimate?: string | null;
  notes?: string;
  confirmationEmailTemplateId?: number;
  reminderEmailTemplateId?: number;
  confirmationEmailTemplateStatus?: boolean;
  reminderEmailTemplateStatus?: boolean;
  times?: { date: string; time: string }[];
  timezone?: string;
}

export async function editAppointment({
  id,
  appointment,
}: {
  id: number;
  appointment: AppointmentToUpdate;
}): Promise<ServerAction> {
  try {
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    if (appointment.draftEstimate) {
      // Check if the draftEstimate is same as the previous one
      const existingAppointment = await db.appointment.findUnique({
        where: {
          id,
        },
      });

      if (existingAppointment?.draftEstimate !== appointment.draftEstimate) {
        // Create draft estimate (if doesn't exist)
        const draftEstimate = await db.invoice.findFirst({
          where: {
            id: appointment.draftEstimate,
          },
        });

        if (!draftEstimate) {
          await db.invoice.create({
            data: {
              id: appointment.draftEstimate,
              type: "Estimate",
              clientId: appointment.clientId,
              vehicleId: appointment.vehicleId,
              userId: session.user.id as any,
              companyId,
            },
          });
        }
      }
    }

    // Update the appointment
    let updatedAppointment = await db.appointment.update({
      where: {
        id,
      },
      data: {
        title: appointment.title,
        date: appointment.date ? new Date(appointment.date) : undefined,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        clientId: appointment.clientId,
        vehicleId: appointment.vehicleId,
        draftEstimate: appointment.draftEstimate,
        notes: appointment.notes,
        confirmationEmailTemplateId: appointment.confirmationEmailTemplateId,
        confirmationEmailTemplateStatus:
          appointment.confirmationEmailTemplateStatus,
        reminderEmailTemplateId: appointment.reminderEmailTemplateId,
        reminderEmailTemplateStatus: appointment.reminderEmailTemplateStatus,
        times: appointment.times,
      },
    });

    // Loop the assigned users and add them to the Google Calendar
    for (const user of appointment.assignedUsers) {
      const assignedUser = await db.user.findUnique({
        where: {
          id: user,
        },
      });

      // TODO: Add the task to the user's Google Calendar

      // Create the task user
      await db.appointmentUser.create({
        data: {
          appointmentId: id,
          userId: user,
          eventId: "null-for-now",
        },
      });
    }

    revalidatePath("/task");

    // if the appointment has date, start time and end time, then insert it in google calendar
    // also need to check if google calendar token exists or not, if not, then no need of inserting
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (
      googleCalendarToken &&
      updatedAppointment.googleEventId &&
      updatedAppointment.startTime &&
      updatedAppointment.endTime &&
      updatedAppointment.date
    ) {
      await updateGoogleCalendarEvent(
        updatedAppointment.googleEventId,
        appointment,
      );
    } else if (
      googleCalendarToken &&
      !updatedAppointment.googleEventId &&
      updatedAppointment.startTime &&
      updatedAppointment.endTime &&
      updatedAppointment.date
    ) {
      let event = await createGoogleCalendarEvent(appointment);

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
