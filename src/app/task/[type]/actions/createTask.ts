"use server";

import { db } from "@/lib/db";
import { Priority } from "@prisma/client";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { ServerAction } from "@/types/action";

interface TaskType {
  title: string;
  description: string;
  assignedUsers: number[];
  priority: Priority;
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

  return {
    type: "success",
  };
}
