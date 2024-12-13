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
    // Authenticate the user
    const session = (await auth()) as AuthSession;
    const { companyId, id: userId } = session.user;

    // Validate the title
    if (!appointment.title) {
      return { type: "error", message: "Title is required", field: "title" };
    }

    // Create a new appointment
    let newAppointment = await db.appointment.create({
      data: { ...appointment, companyId, userId: parseInt(userId) },
    });

    // Assign users and handle Google Calendar
    await assignUsersAndHandleCalendar(
      newAppointment.id,
      appointment.assignedUsers,
    );

    // Handle draft estimate
    await handleDraftEstimate(appointment, companyId);

    // Revalidate the path
    revalidatePath("/task");

    // Send emails
    await sendEmails(appointment, newAppointment);

    // Handle Google Calendar event creation
    await handleGoogleCalendarEvent(appointment, newAppointment);

    return { type: "success" };
  } catch (error) {
    console.error("Error adding appointment:", error);
    return { type: "error", message: "Failed to add the appointment." };
  }
}

// Helper functions
async function assignUsersAndHandleCalendar(
  appointmentId: number,
  assignedUsers: number[],
) {
  for (const user of assignedUsers) {
    // ...existing code...
    await db.appointmentUser.create({
      data: { appointmentId, userId: user, eventId: "null-for-now" },
    });
  }
}

async function handleDraftEstimate(
  appointment: AppointmentToAdd,
  companyId: number,
) {
  if (appointment.draftEstimate) {
    const existingEstimate = await db.invoice.findFirst({
      where: { id: appointment.draftEstimate },
    });
    if (!existingEstimate) {
      await db.invoice.create({
        data: {
          id: appointment.draftEstimate,
          type: "Estimate",
          clientId: appointment.clientId,
          vehicleId: appointment.vehicleId,
          userId: parseInt(appointment.draftEstimate),
          companyId,
        },
      });
    }
  }
}

async function sendEmails(appointment: AppointmentToAdd, appointmentData: any) {
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
}

async function handleGoogleCalendarEvent(
  appointment: AppointmentToAdd,
  appointmentData: any,
) {
  const googleCalendarToken = cookies().get("googleCalendarToken")?.value;
  if (
    googleCalendarToken &&
    appointment.startTime &&
    appointment.endTime &&
    appointment.date
  ) {
    const event = await createGoogleCalendarEvent(appointment);
    if (event?.id) {
      await db.appointment.update({
        where: { id: appointmentData.id },
        data: { googleEventId: event.id },
      });
    }
  }
}
