"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import cron from "node-cron";
import createGoogleCalendarEvent from "../task/google-calendar/createGoogleCalendarEvent";

export interface AppointmentToAdd {
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  assignedUsers: number[];
  clientId?: number;
  vehicleId?: number;
  draftEstimate: string | null;
  notes?: string;
  confirmationEmailTemplateId?: number;
  reminderEmailTemplateId?: number;
  confirmationEmailTemplateStatus?: boolean;
  reminderEmailTemplateStatus?: boolean;
  times?: { date: string; time: string }[];
  timezone?: string;
}

/**
 * Adds a new appointment to the database.
 *
 * @param appointment - The new appointment data.
 * @returns A promise that resolves to a ServerAction indicating the result.
 */
export async function addAppointment(
  appointment: AppointmentToAdd,
): Promise<ServerAction> {
  try {
    // Authenticate the user and get the session
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    // Validate the title
    if (!appointment.title) {
      return {
        type: "error",
        message: "Title is required",
        field: "title",
      };
    }

    // Create a new appointment in the database
    let newAppointment = await db.appointment.create({
      data: {
        title: appointment.title,
        date: appointment.date ? new Date(appointment.date) : undefined,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        clientId: appointment.clientId,
        vehicleId: appointment.vehicleId,
        draftEstimate: appointment.draftEstimate,
        notes: appointment.notes,
        userId: parseInt(session.user.id),
        confirmationEmailTemplateId: appointment.confirmationEmailTemplateId,
        confirmationEmailTemplateStatus:
          appointment.confirmationEmailTemplateStatus,
        reminderEmailTemplateId: appointment.reminderEmailTemplateId,
        reminderEmailTemplateStatus: appointment.reminderEmailTemplateStatus,
        times: appointment.times,
        companyId,
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
          appointmentId: newAppointment.id,
          userId: user,
          eventId: "null-for-now",
        },
      });
    }

    // TODO: use `createDraftEstimate` action
    // Create draft estimate if it doesn't exist
    if (appointment.draftEstimate) {
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

    // Revalidate the path to update the cache
    revalidatePath("/task");

    // Fetch the vehicle and client details
    const vehicle = await db.vehicle.findFirst({
      where: {
        id: appointment.vehicleId,
      },
    });

    const client = await db.client.findFirst({
      where: {
        id: appointment.clientId,
      },
    });

    // Get the confirmation email template
    const confirmationEmailTemplate = await db.emailTemplate.findFirst({
      where: {
        id: appointment.confirmationEmailTemplateId,
      },
    });

    // Get the reminder email template
    const reminderEmailTemplate = await db.emailTemplate.findFirst({
      where: {
        id: appointment.reminderEmailTemplateId,
      },
    });

    // Send the confirmation email if the template exists and status is true
    if (confirmationEmailTemplate) {
      let confirmationSubject = confirmationEmailTemplate?.subject || "";
      let confirmationMessage = confirmationEmailTemplate?.message || "";

      // Replace the placeholders: <VEHICLE>, <CLIENT>
      confirmationSubject = confirmationSubject?.replace(
        "<VEHICLE>",
        vehicle ? vehicle.model! : "",
      );
      confirmationSubject = confirmationSubject?.replace(
        "<CLIENT>",
        client ? client.firstName + " " + client.lastName : "",
      );

      confirmationMessage = confirmationMessage?.replace(
        "<VEHICLE>",
        vehicle ? vehicle.model! : "",
      );
      confirmationMessage = confirmationMessage?.replace(
        "<CLIENT>",
        client ? client.firstName + " " + client.lastName : "",
      );

      // Send the confirmation email
      if (appointment.confirmationEmailTemplateStatus) {
        if (client) {
          sendEmail({
            to: client.email || "",
            subject: confirmationSubject,
            text: confirmationMessage,
          });
        }
      }
    }

    // Schedule the reminder email if the template exists and status is true
    if (reminderEmailTemplate) {
      let reminderSubject = reminderEmailTemplate?.subject || "";
      let reminderMessage = reminderEmailTemplate?.message || "";

      // Replace the placeholders: <VEHICLE>, <CLIENT>
      reminderSubject = reminderSubject?.replace(
        "<VEHICLE>",
        vehicle ? vehicle.model! : "",
      );
      reminderSubject = reminderSubject?.replace(
        "<CLIENT>",
        client ? client.firstName + " " + client.lastName : "",
      );

      reminderMessage = reminderMessage?.replace(
        "<VEHICLE>",
        vehicle ? vehicle.model! : "",
      );
      reminderMessage = reminderMessage?.replace(
        "<CLIENT>",
        client ? client.firstName + " " + client.lastName : "",
      );

      const times = appointment.times;

      if (!times || times.length === 0) return { type: "success" };

      for (const time of times) {
        const date = new Date(time.date);
        const splitTime = time.time.split(":");
        date.setHours(parseInt(splitTime[0]));
        date.setMinutes(parseInt(splitTime[1]));

        // Schedule the reminder email
        if (appointment.reminderEmailTemplateStatus) {
          // Calculate the cron expression for the date and time
          const cronExpression = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

          // Schedule the email
          cron.schedule(cronExpression, () => {
            if (client) {
              sendEmail({
                to: client.email || "",
                subject: reminderSubject,
                text: reminderMessage,
              });
            }
          });
        }
      }
    }

    // Check if Google Calendar token exists and create Google Calendar event
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (
      googleCalendarToken &&
      appointment.startTime &&
      appointment.endTime &&
      appointment.date
    ) {
      let event = await createGoogleCalendarEvent(appointment);

      // Save the event ID in the database if the event is successfully created in Google Calendar
      if (event && event.id) {
        newAppointment = await db.appointment.update({
          where: {
            id: newAppointment.id,
          },
          data: {
            googleEventId: event.id,
          },
        });
      }
    }

    // Return a success action
    return { type: "success" };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    // Return an error action
    return { type: "error" };
  }
}
