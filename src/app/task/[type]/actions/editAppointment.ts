"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

interface AppointmentToAdd {
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  assignedUsers: number[];
  customerId?: number;
  vehicleId?: number;
  draftEstimate?: string | null;
  notes?: string;
  confirmationEmailTemplateId?: number;
  reminderEmailTemplateId?: number;
  confirmationEmailTemplateStatus?: boolean;
  reminderEmailTemplateStatus?: boolean;
  times?: { date: string; time: string }[];
}

export async function editAppointment({
  id,
  appointment,
}: {
  id: number;
  appointment: AppointmentToAdd;
}): Promise<ServerAction> {
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
            customerId: appointment.customerId,
            vehicleId: appointment.vehicleId,
            userId: session.user.id as any,
            companyId,
          },
        });
      }
    }
  }

  // Update the appointment
  await db.appointment.update({
    where: {
      id,
    },
    data: {
      title: appointment.title,
      date: appointment.date ? new Date(appointment.date) : undefined,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      customerId: appointment.customerId,
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

  return {
    type: "success",
  };
}
