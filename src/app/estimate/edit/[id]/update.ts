"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Labor, Material, Service, Tag } from "@prisma/client";

interface UpdateEstimateInput {
  id: string;
  title: string;

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
    material: Material | null;
    labor: Labor | null;
    tags: Tag[];
  }[];
}

export async function update(data: UpdateEstimateInput): Promise<ServerAction> {
  // update invoice itself
  await db.invoice.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
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
    const material = item.material;
    const labor = item.labor;
    const tags = item.tags;

    const invoiceItem = await db.invoiceItem.create({
      data: {
        invoiceId: data.id,
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

  return {
    type: "success",
  };
}
