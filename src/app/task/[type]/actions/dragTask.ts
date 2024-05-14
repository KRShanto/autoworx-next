"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

// TODO: later, use updateTask instead of dragTask
export async function dragTask(task: any): Promise<ServerAction> {
  await db.task.update({
    where: {
      id: task.id,
    },
    data: {
      date: task.date,
      startTime: task.startTime,
      endTime: task.endTime,
    },
  });

  revalidatePath("/task");

  return {
    type: "success",
  };
}
