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

/**
 * Creates a new invoice with the provided data.
 * @param params - The data to create the invoice with.
 * @returns A promise that resolves to a ServerAction indicating success or error.
 */
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
  // Authenticate the user and get the session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Determine the final column ID
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

  // Adjust the invoice type based on the column title
  if (finalColumnId) {
    const column = await db.column.findUnique({
      where: {
        id: finalColumnId,
      },
    });

    if (column) {
      type = column.title === "In Progress" ? "Invoice" : type;
    } else {
      throw new Error("Column not found to create invoice conversions");
    }
  }

  // Calculate the total cost of materials and labor
  const totalCost = items.reduce((acc, item) => {
    const materialCostPrice = item.materials.reduce(
      (acc, cur) => acc + Number(cur?.cost) * Number(cur?.quantity),
      0,
    );
    const laborCostPrice = Number(item.labor?.charge) * Number(item.labor?.hours);

    return acc + materialCostPrice + laborCostPrice;
  }, 0);

  // Create the invoice in the database
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

  // Upload photos associated with the invoice
  photos.forEach(async (photo) => {
    await db.invoicePhoto.create({
      data: {
        invoiceId: invoice.id,
        photo,
      },
    });
  });

  // Create items, materials, labor, and tags associated with the invoice
  items.forEach(async (item) => {
    const service = item.service;
    const materials = item.materials;
    const labor = item.labor;
    const tags = item.tags;

    // Create new labor entry if labor is provided
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

    // Create the invoice item
    const invoiceItem = await db.invoiceItem.create({
      data: {
        invoiceId: invoice.id,
        serviceId: service?.id,
        laborId: laborId,
      },
    });

    // Create materials associated with the invoice item
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

    // Create tags associated with the invoice item
    tags.forEach(async (tag) => {
      await db.itemTag.create({
        data: {
          itemId: invoiceItem.id,
          tagId: tag.id,
        },
      });
    });
  });

  // Create tasks associated with the invoice
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

  // Update the coupon if provided
  if (coupon) {
    await db.coupon.update({
      where: {
        id: coupon.id,
      },
      data: {
        redemptions: coupon.redemptions + 1,
      },
    });

    // Create a client coupon entry
    await db.clientCoupon.create({
      data: {
        clientId: clientId!,
        couponId: coupon.id,
      },
    });
  }

  // Revalidate the path to update the cache
  revalidatePath("/estimate");

  return {
    type: "success",
    data: invoice,
  };
}
