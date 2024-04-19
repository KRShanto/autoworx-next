"use server";

import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { Service } from "@prisma/client";

export async function addEmployee({
  workOrderId,
  employeeId,
  invoiceId,
}: {
  workOrderId: number;
  employeeId: number;
  invoiceId: string;
}) {
  // Assign employee to work order
  await db.user.update({
    where: { id: employeeId },
    data: {
      workOrderId,
    },
  });

  // Find the invoice
  const invoice = await db.invoice.findUnique({
    where: { invoiceId },
  });

  // Find services
  const serviceId = (invoice?.serviceIds as number[])[0];

  await db.service.findUnique({
    where: { id: serviceId },
  });

  // Find the task
  const task = await db.task.findFirst({
    where: { workOrderId },
  });

  // TODO: Add task to google calendar

  // Create TaskUser
  await db.taskUser.create({
    data: {
      taskId: task?.id!,
      userId: employeeId,
      eventId: "null-for-now",
    },
  });

  revalidatePath("/invoice");
}
