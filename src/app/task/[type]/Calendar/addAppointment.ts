"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { TaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface TaskToAdd {
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: TaskType;
  assignedUsers: number[];
  clientId?: number;
  vehicleId?: number;
  orderId?: number;
  notes?: string;
}

export async function addAppointment(task: TaskToAdd) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newTask = await db.task.create({
    data: {
      title: task.title,
      date: task.date ? new Date(task.date) : new Date(),
      startTime: task.startTime || "10:00",
      endTime: task.endTime || "18:00",
      type: task.type || TaskType.appointment,
      customerId: task.clientId,
      vehicleId: task.vehicleId,
      orderId: task.orderId,
      notes: task.notes,
      userId: parseInt(session.user.id),
      companyId,
    },
  });

  // Loop the assigned users and add them to the Google Calendar
  for (const user of task.assignedUsers) {
    const assignedUser = await db.user.findUnique({
      where: {
        id: user,
      },
    });

    // TODO: Add the task to the user's Google Calendar

    // Create the task user
    await db.taskUser.create({
      data: {
        taskId: newTask.id,
        userId: user,
        eventId: "null-for-now",
      },
    });
  }

  revalidatePath("/task");
}
