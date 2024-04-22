"use server";

import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";
import { Service } from "@prisma/client";

export default async function createWorkOrder(invoiceId: number) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const workOrder = await db.workOrder.create({
    data: {
      invoiceId,
      activeStatus: "Active",
      companyId,
    },
  });

  // Find the invoice
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
  });

  // Find services
  const serviceId = (invoice?.serviceIds as number[])[0];

  const service = (await db.service.findUnique({
    where: { id: serviceId },
  })) as Service;

  // Create Task
  const task = await db.task.create({
    data: {
      title: service.name,
      date: new Date(),
      startTime: "10:00",
      endTime: "18:00",
      type: "task",
      companyId,
      userId: parseInt(session.user.id),
      workOrderId: workOrder.id,
    },
  });

  // TODO: Google Calendar Integration

  revalidatePath("/invoice");
  return workOrder.id;
}
