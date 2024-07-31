"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";
import cron from "node-cron";

interface AppointmentToAdd {
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
}

export async function addAppointment(
  appointment: AppointmentToAdd,
): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  if (!appointment.title) {
    return {
      type: "error",
      message: "Title is required",
      field: "title",
    };
  }

  const newAppointment = await db.appointment.create({
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
        appointmentId: newAppointment.id,
        userId: user,
        eventId: "null-for-now",
      },
    });
  }

  // Create draft estimate (if doesn't exist)
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

  revalidatePath("/task");

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

  // get the confirmation email template
  const confirmationEmailTemplate = await db.emailTemplate.findFirst({
    where: {
      id: appointment.confirmationEmailTemplateId,
    },
  });

  // get the reminder email template
  const reminderEmailTemplate = await db.emailTemplate.findFirst({
    where: {
      id: appointment.reminderEmailTemplateId,
    },
  });

  if (confirmationEmailTemplate) {
    let confirmationSubject = confirmationEmailTemplate?.subject || "";
    let confirmationMessage = confirmationEmailTemplate?.message || "";

    // replace the placeholders: <VEHICLE>, <CLIENT>
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

    // send the confirmation email
    if (appointment.confirmationEmailTemplateStatus) {
      // send email
      if (client) {
        sendEmail({
          from: "Autoworx",
          to: client.email || "",
          subject: confirmationSubject,
          text: confirmationMessage,
        });
      }
    }
  }

  if (reminderEmailTemplate) {
    let reminderSubject = reminderEmailTemplate?.subject || "";
    let reminderMessage = reminderEmailTemplate?.message || "";

    // replace the placeholders: <VEHICLE>, <CLIENT>
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

      // schedule the reminder email
      if (appointment.reminderEmailTemplateStatus) {
        // calculate the cron expression for the date and time
        const cronExpression = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

        // schedule the email
        cron.schedule(cronExpression, () => {
          if (client) {
            sendEmail({
              from: "Autoworx",
              to: client.email || "",
              subject: reminderSubject,
              text: reminderMessage,
            });
          }
        });
      }
    }
  }

  return { type: "success" };
}
