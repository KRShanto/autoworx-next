"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

type TTask = {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
};

// TODO: later, use updateTask instead of dragTask
export async function dragTask(task: TTask): Promise<ServerAction> {
  const oldTask = await db.task.findUnique({
    where: {
      id: task.id,
    },
  });

  await db.task.update({
    where: {
      id: task.id,
    },
    data: {
      date: new Date(task.date),
      startTime: oldTask?.startTime || task.startTime,
      endTime: oldTask?.endTime || task.endTime,
    },
  });

  revalidatePath("/task");

  return {
    type: "success",
  };
}

export async function updateTask(task: TTask): Promise<ServerAction> {
  await db.task.update({
    where: {
      id: task.id,
    },
    data: {
      date: new Date(task?.date).toISOString(),
      startTime: task?.startTime,
      endTime: task?.endTime,
    },
  });

  revalidatePath("/task");

  return {
    type: "success",
  };
}
