"use server";

import { auth } from "@/app/auth";
import { createTask } from "@/app/task/[type]/actions/createTask";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import {
  Task,
  InvoiceType,
  Service,
  Material,
  Labor,
  Tag,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function create({
  title,
  invoiceId,
  type,

  clientId,
  vehicleId,
  statusId,

  subtotal,
  discount,
  tax,
  deposit,
  depositNotes,
  depositMethod,
  grandTotal,
  due,

  internalNotes,
  terms,
  policy,
  customerNotes,
  customerComments,

  photos,
  items,
  tasks,
}: {
  title: string;
  invoiceId: string;
  type: InvoiceType;

  clientId?: number;
  vehicleId?: number;
  statusId?: number;

  subtotal: number;
  discount: number;
  tax: number;
  deposit: number;
  depositNotes: string;
  depositMethod: string;
  grandTotal: number;
  due: number;

  internalNotes: string;
  terms: string;
  policy: string;
  customerNotes: string;
  customerComments: string;

  photos: string[];
  items: {
    service: Service | null;
    material: Material | null;
    labor: Labor | null;
    tags: Tag[];
  }[];

  tasks: { id: undefined | number; task: string }[];
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const invoice = await db.invoice.create({
    data: {
      id: invoiceId,
      title,
      type,
      customerId: clientId,
      vehicleId,
      statusId,
      subtotal,
      discount,
      tax,
      deposit,
      depositNotes,
      depositMethod,
      grandTotal,
      due,
      internalNotes,
      terms,
      policy,
      customerNotes,
      customerComments,
      companyId,
    },
  });

  // Upload photos
  photos.forEach(async (photo) => {
    await db.invoicePhoto.create({
      data: {
        invoiceId: invoice.id,
        photo,
      },
    });
  });

  items.forEach(async (item) => {
    const service = item.service;
    const material = item.material;
    const labor = item.labor;
    const tags = item.tags;

    const invoiceItem = await db.invoiceItem.create({
      data: {
        invoiceId: invoice.id,
        serviceId: service?.id,
        materialId: material?.id,
        laborId: labor?.id,
      },
    });

    tags.forEach(async (tag) => {
      await db.itemTag.create({
        data: {
          itemId: invoiceItem.id,
          tagId: tag.id,
        },
      });
    });
  });

  tasks.forEach(async (task) => {
    if (!task) return;

    const taskSplit = task.task.split(":");

    await createTask({
      title: taskSplit[0].trim(),
      description: taskSplit.length > 1 ? taskSplit[1].trim() : "",
      priority: "Medium",
      assignedUsers: [],
      invoiceId: invoice.id,
    });
  });

  revalidatePath("/estimate");

  return {
    type: "success",
    data: invoice,
  };
}
