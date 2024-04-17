"use server";

import { db } from "@/lib/db";
import { Task, TaskType } from "@prisma/client";
import { auth } from "../auth";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

export async function addTask(task: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: TaskType;
  assignedUsers: number[];
}) {
  const session = (await auth()) as AuthSession;

  if (!task.title) {
    return { message: "Title is required", field: "title" };
  }

  const newTask = await db.task.create({
    data: {
      title: task.title,
      type: task.type,
      startTime: task.startTime,
      endTime: task.endTime,
      date: new Date(task.date),
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

  return true;
}
