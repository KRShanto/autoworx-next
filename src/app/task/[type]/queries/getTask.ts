'use server'

import { db } from "@/lib/db";

export const getTask = async (taskId: number) => {
  try {
    const task = await db.task.findUnique({
    where: {
      id: taskId,
        },
    });
    return task;
  } catch (err) {
    throw err
  }
}