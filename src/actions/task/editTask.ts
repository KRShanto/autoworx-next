"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Priority } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface TaskType {
  title: string;
  description: string;
  assignedUsers: number[];
  priority: Priority;
  startTime?: string;
  endTime?: string;
}

export async function editTask({
  id,
  task,
}: {
  id: number;
  task: TaskType;
}): Promise<ServerAction> {
  // Find the task users
  const taskUsers = await db.taskUser.findMany({
    where: {
      taskId: id,
    },
  });

  const assignedUsers = task.assignedUsers;

  // Find the difference between the existing users and the new users
  const toRemove = taskUsers.filter(
    (taskUser) => !assignedUsers?.includes(taskUser.userId),
  );
  const toAdd = assignedUsers?.filter(
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

  if (Array.isArray(toAdd)) {
    // Add the users
    for (const user of toAdd) {
      // TODO: Add the task to the user's Google Calendar

      // Create the task user
      await db.taskUser.create({
        data: {
          taskId: id,
          userId: user,
          eventId: "null-for-now",
        },
      });
    }
  }

  // Update the task
  await db.task.update({
    where: {
      id,
    },
    data: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      startTime: task.startTime,
      endTime: task.endTime,
    },
  });

  revalidatePath("/task");
  revalidatePath("/communication/client");

  return {
    type: "success",
  };
}
