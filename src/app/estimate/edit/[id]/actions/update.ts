"use server";

import { createTask } from "@/app/task/[type]/actions/createTask";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Labor, Material, Service, Tag } from "@prisma/client";

interface UpdateEstimateInput {
  id: string;

  customerId: number | undefined;
  vehicleId: number | undefined;
  statusId: number | undefined;

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

  //   photos: string[]; // TODO
  items: {
    service: Service | null;
    materials: (Material | null)[];
    labor: Labor | null;
    tags: Tag[];
  }[];
  tasks: { id: undefined | number; task: string }[];
}

export async function update(data: UpdateEstimateInput): Promise<ServerAction> {
  const companyId = await getCompanyId();

  // update invoice itself
  await db.invoice.update({
    where: {
      id: data.id,
    },
    data: {
      customerId: data.customerId,
      vehicleId: data.vehicleId,
      statusId: data.statusId,
      subtotal: data.subtotal,
      discount: data.discount,
      tax: data.tax,
      deposit: data.deposit,
      depositNotes: data.depositNotes,
      depositMethod: data.depositMethod,
      grandTotal: data.grandTotal,
      due: data.due,
      internalNotes: data.internalNotes,
      terms: data.terms,
      policy: data.policy,
      customerNotes: data.customerNotes,
      customerComments: data.customerComments,
    },
  });

  // delete existing items
  await db.invoiceItem.deleteMany({
    where: {
      invoiceId: data.id,
    },
  });

  // create new items
  data.items.forEach(async (item) => {
    const service = item.service;
    const materials = item.materials;
    const labor = item.labor;
    const tags = item.tags;

    const invoiceItem = await db.invoiceItem.create({
      data: {
        invoiceId: data.id,
        serviceId: service?.id,
        laborId: labor?.id,
      },
    });

    // Delete existing materials
    await db.material.deleteMany({
      where: {
        invoiceItemId: invoiceItem.id,
      },
    });

    // Create materials
    materials.forEach(async (material) => {
      if (!material) return;

      await db.material.create({
        data: {
          name: material.name,
          vendorId: material.vendorId,
          categoryId: material.categoryId,
          notes: material.notes,
          quantity: material.quantity,
          cost: material.cost,
          sell: material.sell,
          discount: material.discount,
          invoiceId: data.id,
          companyId,
          invoiceItemId: invoiceItem.id,
          productId: material.productId,
        },
      });
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

  data.tasks.forEach(async (task) => {
    // if task.id is undefined, create a new task
    if (task.id === undefined) {
      await createTask({
        title: task.task.split(":")[0],
        description: task.task.length > 1 ? task.task.split(":")[1] : "",
        assignedUsers: [],
        priority: "Medium",
        invoiceId: data.id,
      });
    } else {
      // if task.id is not undefined, update the task
      await db.task.update({
        where: {
          id: task.id,
        },
        data: {
          title: task.task.split(":")[0],
          description: task.task.length > 1 ? task.task.split(":")[1] : "",
        },
      });
    }
  });

  return {
    type: "success",
  };
}
