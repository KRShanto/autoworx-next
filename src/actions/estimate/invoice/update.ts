"use server";
import { createTask } from "@/actions/task/createTask";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { InvoiceType, Labor, Material, Service, Tag } from "@prisma/client";
import fs from "fs";
import { revalidatePath } from "next/cache";

interface UpdateEstimateInput {
  id: string;

  clientId: number | undefined;
  vehicleId: number | undefined;

  columnId: number | undefined;

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
  type: InvoiceType;
}

export async function updateInvoice(
  data: UpdateEstimateInput,
): Promise<ServerAction> {
  console.log("Start of the updateInvoice function");

  const companyId = await getCompanyId();

  console.log("Company ID: ", companyId);

  const invoice = await db.invoice.findUnique({
    where: {
      id: data.id,
    },
  });

  console.log("Invoice: ", invoice);

  if (invoice?.type === "Invoice") {
    console.log("Invoice type is 'Invoice'");
    // merge all the same products and sum the quantity
    let materials: Material[] = [];

    for (const item in data.items) {
      const itemMaterials = data.items[item].materials;

      if (itemMaterials) {
        // @ts-ignore
        materials = [...materials, ...itemMaterials];
      }
    }

    console.log("All materials: ", materials);

    const productsWithQuantity = materials.reduce(
      (acc: { id: number; quantity: number }[], material) => {
        //handle null or undefined product id error
        if (!material || material.productId === undefined) {
          return acc;
        }
        const product = acc.find((p) => p.id === material.productId);

        if (product) {
          if (material.quantity !== null) {
            product.quantity += material.quantity;
          }
        } else {
          acc.push({
            id: material.productId as number,
            quantity: material.quantity || 0,
          });
        }

        return acc;
      },
      [],
    );

    console.log("Products with quantity: ", productsWithQuantity);

    await Promise.all(
      productsWithQuantity.map(async (product) => {
        if (!product.id) return;

        const inventoryProduct = await db.inventoryProduct.findUnique({
          where: {
            id: product.id,
          },
        });

        if (!inventoryProduct) {
          return;
        }

        // const newQuantity = Math.abs(
        //   inventoryProduct.quantity - product.quantity,
        // );

        const oldMaterials = await db.material.findMany({
          where: {
            invoiceId: data.id,
            productId: product.id,
          },
        });

        const oldQuantity = oldMaterials.reduce((acc, material) => {
          return acc + material.quantity!;
        }, 0);

        console.log("old quantity: ", oldQuantity);
        console.log("new quantity: ", product.quantity);

        const diffQuantity = oldQuantity - product.quantity;

        console.log("difference: : ", diffQuantity);

        // Update the history quantity
        await db.inventoryProductHistory.update({
          where: {
            id: inventoryProduct.id,
          },
          data: {
            quantity: product.quantity,
          },
        });

        console.log("Updated the history quantity");

        // Update the inventoryProduct quantity
        await db.inventoryProduct.update({
          where: {
            id: product.id,
          },
          data: {
            quantity: {
              increment: diffQuantity,
            },
          },
        });

        console.log("Updated the inventoryProduct quantity");
      }),
    );
  }

  if (data.columnId) {
    const column = await db.column.findUnique({
      where: { id: data.columnId },
    });

    if (column) {
      data.type = column.title === "In Progress" ? "Invoice" : data.type;
    } else {
      data.columnId = undefined;
      data.type = "Estimate";
    }
    console.log("Column: ", column);
  }

  console.log("Re-calculating the profit");
  // re-calculating the profit
  const totalCost = data.items.reduce((acc, item) => {
    const materials = item.materials;
    const labor = item.labor;

    const materialCost = materials.reduce((acc, material) => {
      return acc + Number(material?.cost) * Number(material?.quantity);
    }, 0);

    const laborCost = Number(labor?.charge) * Number(labor?.hours);

    return acc + materialCost + laborCost;
  }, 0);

  console.log("Total cost: ", totalCost);

  // update invoice itself
  const updatedInvoice = await db.invoice.update({
    where: {
      id: data.id,
    },
    data: {
      clientId: data.clientId,
      vehicleId: data.vehicleId,
      profit: data.grandTotal - totalCost,
      columnId: data.columnId ?? null,
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
      type: data.type,
    },
  });

  console.log("Updated the invoice");

  // get existing photos
  const previousPhotos = await db.invoicePhoto.findMany({
    where: {
      invoiceId: data.id,
    },
  });

  // remove the files
  previousPhotos.forEach(async (photo) => {
    const photoPath = `images/uploads/${photo.photo}`;
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
  });

  // delete existing photos
  await db.invoicePhoto.deleteMany({
    where: {
      invoiceId: data.id,
    },
  });

  // create new photos
  data.photos.forEach(async (photo) => {
    await db.invoicePhoto.create({
      data: {
        invoiceId: data.id,
        photo,
      },
    });
  });

  console.log("Updated the photos");
  // delete existing items
  await db.invoiceItem.deleteMany({
    where: {
      invoiceId: data.id,
    },
  });

  console.log("Deleted the existing items");

  data.items.forEach(async (item) => {
    const service = item.service;
    const materials = item.materials;
    const labor = item.labor;
    const tags = item.tags;

    let laborId;
    // delete existing labors
    if (labor) {
      const existingLabor = await db.labor.findUnique({
        where: {
          id: labor.id,
        },
      });

      if (existingLabor) {
        await db.labor.delete({
          where: {
            id: labor.id,
          },
        });

        console.log("Deleted the existing labor");
      }
    }

    // create new labor
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

      console.log("Created the new labor");
    }

    // create new items
    const invoiceItem = await db.invoiceItem.create({
      data: {
        invoiceId: data.id,
        serviceId: service?.id,
        laborId,
      },
    });

    console.log("Created the new invoice item");

    // Delete existing materials
    await db.material.deleteMany({
      where: {
        invoiceItemId: invoiceItem.id,
      },
    });

    console.log("Deleted the existing materials");

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

      console.log("Created the new material");
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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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

  revalidatePath("/estimate");

  return {
    type: "success",
    data: updatedInvoice,
  };
}
