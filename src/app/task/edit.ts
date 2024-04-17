"use server";

import { db } from "@/lib/db";
import { Task } from "@prisma/client";
import { auth } from "../auth";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

export async function editTask({
  task,
  id,
}: {
  task: Task & { assignedUsers: number[] };
  id: number;
}) {
  const session = (await auth()) as AuthSession;

  // Find the task
  const existingTask = await db.task.findUnique({
    where: {
      id,
    },
  });

  // Find the task users
  const taskUsers = await db.taskUser.findMany({
    where: {
      taskId: id,
    },
  });

  const assignedUsers = task.assignedUsers;

  // Find the difference between the existing users and the new users
  const toRemove = taskUsers.filter(
    (taskUser) => !assignedUsers.includes(taskUser.userId),
  );
  const toAdd = assignedUsers.filter(
    (userId) => !taskUsers.find((taskUser) => taskUser.userId === userId),
  );

  // Remove the users
  for (const user of toRemove) {
    // TODO: Remove the task from the user's Google Calendar

    await db.taskUser.delete({
      where: {
        id: user.id,
      },
    });
  }

  // Add the users
  for (const user of toAdd) {
    // TODO: Add the task to the user's Google Calendar

    const assignedUser = await db.user.findUnique({
      where: {
        id: user,
      },
    });

    await db.taskUser.create({
      data: {
        taskId: id,
        userId: user,
        eventId: "null-for-now",
      },
    });
  }

  // Update the task
  await db.task.update({
    where: {
      id,
    },
    data: {
      ...task,
    },
  });

  revalidatePath("/task");

  return true;
}
