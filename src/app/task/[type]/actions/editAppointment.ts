"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface AppointmentToAdd {
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  assignedUsers: number[];
  customerId?: number;
  vehicleId?: number;
  orderId?: number;
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
}) {
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
      orderId: appointment.orderId,
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

  return true;
}
