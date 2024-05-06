"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function removeEmployee({ employeeId }: { employeeId: number }) {
  // Get the employee
  const employee = await db.user.findUnique({
    where: { id: employeeId },
  });

  // TODO: skipped this part
  // // Get the task
  // const task = await db.task.findFirst({
  //   where: { workOrderId: employee?.workOrderId },
  // });

  // // TODO: Delete employee from Google Calendar

  // // delete the task user
  // await db.taskUser.deleteMany({
  //   where: { taskId: task?.id },
  // });

  // // remove employee from work order
  // await db.user.update({
  //   where: { id: employeeId },
  //   data: {
  //     workOrderId: null,
  //   },
  // });

  revalidatePath("/invoice");
  return true;
}
