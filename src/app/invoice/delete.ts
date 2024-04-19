"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// delete: chnge work order status to Archived
export async function deleteWorkOrder(id: number) {
  // chnge work order status to Archived
  await db.workOrder.update({
    where: { id },
    data: {
      activeStatus: "Archived",
    },
  });

  // remove employees from work order
  await db.user.updateMany({
    where: { workOrderId: id },
    data: {
      workOrderId: null,
    },
  });

  // Get the task
  const task = await db.task.findFirst({
    where: { workOrderId: id },
  });

  // Get the task users
  const taskUsers = await db.taskUser.findMany({
    where: { taskId: task?.id },
  });

  // Delete task from Google Calendar
  for (const taskUser of taskUsers) {
    // TODO: Delete task from Google Calendar
  }
  // Delete task users if task is present
  if (task) {
    await db.taskUser.deleteMany({
      where: { taskId: task.id },
    });

    // Delete task
    await db.task.delete({
      where: { id: task.id },
    });
  }

  revalidatePath("/invoice");
  return true;
}
