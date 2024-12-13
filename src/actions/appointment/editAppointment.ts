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

/**
 * Edits an existing appointment.
 *
 * @param id - The ID of the appointment to edit.
 * @param appointment - The new appointment data.
 * @returns A promise that resolves to a ServerAction indicating the result.
 */
export async function editAppointment({
  id,
  appointment,
}: {
  id: number;
  appointment: AppointmentToUpdate;
}): Promise<ServerAction> {
  try {
    // Authenticate the user and get the session
    const session = (await auth()) as AuthSession;
    const { companyId, id: userId } = session.user;

    // Check if the draftEstimate is different from the existing one
    if (appointment.draftEstimate) {
      const existingAppointment = await db.appointment.findUnique({
        where: {
          id,
        },
      });

      if (existingAppointment?.draftEstimate !== appointment.draftEstimate) {
        // Create draft estimate if it doesn't exist
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

    // Update the appointment in the database
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

    // Loop through the assigned users and add them to the Google Calendar
    for (const user of appointment.assignedUsers) {
      const assignedUser = await db.user.findUnique({
        where: {
          id: user,
        },
      });

      // TODO: Add the task to the user's Google Calendar

      // Create the task user in the database
      await db.appointmentUser.create({
        data: {
          appointmentId: id,
          userId: user,
          eventId: "null-for-now",
        },
      });
    }

    // Revalidate the path to update the cache
    revalidatePath("/task");

    // Check if Google Calendar token exists and update or create Google Calendar event
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    // Handle Google Calendar Event
    await handleGoogleCalendarEvent(
      updatedAppointment,
      appointment,
      googleCalendarToken,
    );

    // Return a success action
    return {
      type: "success",
    };
  } catch (error) {
    // Removed useless console.log
    // console.log("🚀 ~ error:", error);

    // Added proper error logging
    console.error("Error editing appointment:", error);

    // Return an error action
    return {
      type: "error",
    };
  }
}

// Helper function
async function handleGoogleCalendarEvent(
  updatedAppointment: any,
  appointment: AppointmentToUpdate,
  googleCalendarToken: string | undefined,
) {
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
    const event = await createGoogleCalendarEvent(appointment);
    if (event?.id) {
      await db.appointment.update({
        where: { id: updatedAppointment.id },
        data: { googleEventId: event.id },
      });
    }
  }
}
