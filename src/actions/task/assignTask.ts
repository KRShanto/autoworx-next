"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function assignTask({
  userId,
  tasksToAssign,
}: {
  userId: number;
  tasksToAssign: {
    taskId: number;
    assigned: boolean;
  }[];
}): Promise<ServerAction> {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tasks: true,
    },
  });

  for (const taskData of tasksToAssign) {
    // Get the task
    const task = await db.task.findUnique({
      where: {
        id: taskData.taskId,
      },
    });

    const shouldAssign = taskData.assigned;

    // get task users
    const taskUsers = await db.taskUser.findMany({
      where: {
        taskId: task!.id,
      },
    });

    // add or remove the user from the task
    if (shouldAssign) {
      // check if the user is already assigned to the task
      // if not, assign the user to the task
      if (!taskUsers.some((taskUser) => taskUser.userId === user!.id)) {
        // TODO: add task to the google calendar

        await db.taskUser.create({
          data: {
            userId: user!.id,
            taskId: task!.id,
            eventId: "null-for-now",
          },
        });
      }
    } else {
      // check if the user is assigned to the task
      // if yes, remove the user from the task
      if (taskUsers.some((taskUser) => taskUser.userId === user!.id)) {
        // TODO: remove task from the google calendar

        await db.taskUser.deleteMany({
          where: {
            taskId: task!.id,
            userId: user!.id,
          },
        });
      }
    }
  }

  revalidatePath("/task");

  return {
    type: "success",
  };
}
