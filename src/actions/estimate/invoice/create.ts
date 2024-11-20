"use server";

import { createTask } from "@/actions/task/createTask";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import {
  Coupon,
  InvoiceType,
  Labor,
  Material,
  Service,
  Tag,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createInvoice({
  invoiceId,
  type,

  clientId,
  vehicleId,

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

  coupon,
  columnId,
}: {
  invoiceId: string;
  type: InvoiceType;

  clientId?: number;
  vehicleId?: number;

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
    materials: (Material | null)[];
    labor: Labor | null;
    tags: Tag[];
  }[];

  tasks: { id: undefined | number; task: string }[];

  coupon?: Coupon | null;
  columnId?: number;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  let finalColumnId = columnId;
  if (!finalColumnId) {
    const defaultColumnId = await db.column.findFirst({
      where: {
        title: "Pending",

        type: "shop",
        companyId,
      },
      select: {
        id: true,
      },
    });
    if (defaultColumnId) {
      finalColumnId = defaultColumnId.id;
    } else {
      throw new Error("Default column not found");
    }
  }

  // calculate the total cost. This is the sum of all the costs of the materials and labor
  const totalCost = items.reduce((acc, item) => {
    const materialCostPrice = item.materials.reduce(
      (acc, cur) => acc + Number(cur?.cost) * Number(cur?.quantity),
      0,
    );
    const laborCostPrice = Number(item.labor?.charge) * item?.labor?.hours!;
    return acc + materialCostPrice + laborCostPrice;
  }, 0);

  const invoice = await db.invoice.create({
    data: {
      id: invoiceId,
      type,
      clientId,
      vehicleId,
      profit: grandTotal - totalCost,
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
      userId: session.user.id as any,
      columnId: finalColumnId,
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
    const materials = item.materials;
    const labor = item.labor;
    const tags = item.tags;

    // Create new labor
    let laborId;
    if (labor) {
      const newLabor = await db.labor.create({
        data: {
          name: labor.name,
          categoryId: labor.categoryId,
          notes: labor.notes,
          hours: labor.hours,
          charge: labor.charge,
          discount: labor.discount,
          companyId,
        },
      });

      laborId = newLabor.id;
    }

    const invoiceItem = await db.invoiceItem.create({
      data: {
        invoiceId: invoice.id,
        serviceId: service?.id,
        laborId: laborId,
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
          invoiceId: invoice.id,
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

  tasks.forEach(async (task) => {
    if (!task) return;

    const taskSplit = task.task.split(":");

    await createTask({
      title: taskSplit[0].trim(),
      description: taskSplit.length > 1 ? taskSplit[1].trim() : "",
      priority: "Medium",
      assignedUsers: [],
      invoiceId: invoice.id,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  });

  // Update coupon
  if (coupon) {
    await db.coupon.update({
      where: {
        id: coupon.id,
      },
      data: {
        redemptions: coupon.redemptions + 1,
      },
    });

    // Create client coupon
    await db.clientCoupon.create({
      data: {
        clientId: clientId!,
        couponId: coupon.id,
      },
    });
  }

  revalidatePath("/estimate");

  return {
    type: "success",
    data: invoice,
  };
}
