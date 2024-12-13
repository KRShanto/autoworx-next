"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Assigns or unassigns tasks to a user.
 *
 * @param userId - The ID of the user.
 * @param tasksToAssign - The list of tasks to assign or unassign.
 * @returns A server action indicating success or error.
 */
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
  // Find the user by ID and include their tasks
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tasks: true,
    },
  });

  for (const taskData of tasksToAssign) {
    // Get the task by ID
    const task = await db.task.findUnique({
      where: {
        id: taskData.taskId,
      },
    });

    const shouldAssign = taskData.assigned;

    // Get users assigned to the task
    const taskUsers = await db.taskUser.findMany({
      where: {
        taskId: task!.id,
      },
    });

    // Add or remove the user from the task
    if (shouldAssign) {
      // Check if the user is already assigned to the task
      // If not, assign the user to the task
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
      // Check if the user is assigned to the task
      // If yes, remove the user from the task
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

  // Revalidate the task path
  revalidatePath("/task");

  return {
    type: "success",
  };
}
