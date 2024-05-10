"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: number) {
  // find the task users
  const taskUsers = await db.taskUser.findMany({
    where: {
      taskId: id,
    },
  });

  // remove the task users
  for (const user of taskUsers) {
    // TODO: Remove the task from the user's Google Calendar
  }

  // remove the task
  await db.task.delete({
    where: {
      id,
    },
  });

  revalidatePath("/task");

  return true;
}
