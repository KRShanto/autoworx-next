"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { Priority } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface TaskType {
  title: string;
  description: string;
  assignedUsers: number[];
  priority: Priority;
  invoiceId?: string;
  startTime?: string;
  endTime?: string;
  clientId?: number | null;
  date: string;
}

export async function createTask(task: TaskType): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;

  const newTask = await db.task.create({
    data: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      userId: parseInt(session.user.id),
      companyId: session.user.companyId,
      invoiceId: task.invoiceId,
      startTime: task.startTime,
      endTime: task.endTime,
      clientId: task.clientId,
      date: task.date,
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
  revalidatePath("/communication/client");

  return {
    type: "success",
    data: newTask,
  };
}
