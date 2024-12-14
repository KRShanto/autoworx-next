"use server";
import { createTask } from "@/actions/task/createTask";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { InvoiceType, Labor, Material, Service, Tag } from "@prisma/client";
import fs from "fs";
import { revalidatePath } from "next/cache";

/**
 * Interface for the input data required to update an estimate.
 */
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

/**
 * Updates an invoice with the provided data.
 * @param data - The data to update the invoice with.
 * @returns A promise that resolves to a ServerAction indicating success or error.
 */
export async function updateInvoice(
  data: UpdateEstimateInput,
): Promise<ServerAction> {
  const companyId = await getCompanyId();

  // If updating to an Invoice, check inventory quantities
  if (data.type === "Invoice") {
    // Merge all the same products and sum the quantity
    let materials: Material[] = [];

    for (const item of data.items) {
      if (item.materials) {
        materials = [...materials, ...(item.materials as Material[])];
      }
    }

    // Include products to get their names
    const productIds = materials
      .map((m) => m.productId)
      .filter(Boolean) as number[];
    const products = await db.inventoryProduct.findMany({
      where: { id: { in: productIds } },
    });

    const productsWithQuantity = materials.reduce(
      (acc: { id: number; quantity: number; name: string }[], material) => {
        const productId = material.productId as number;
        const existing = acc.find((p) => p.id === productId);

        if (existing) {
          if (material.quantity !== null) {
            existing.quantity += material.quantity;
          }
        } else {
          const productName =
            products.find((p) => p.id === productId)?.name || "Product";
          acc.push({
            id: productId,
            quantity: material.quantity || 0,
            name: productName,
          });
        }

        return acc;
      },
      [],
    );

    // Fetch inventory products
    const inventoryProducts = await db.inventoryProduct.findMany({
      where: {
        id: { in: productsWithQuantity.map((p) => p.id) },
      },
    });

    // Check inventory quantities
    for (const product of productsWithQuantity) {
      const inventoryProduct = inventoryProducts.find(
        (ip) => ip.id === product.id,
      );
      if (
        inventoryProduct &&
        (inventoryProduct.quantity || 0) < product.quantity
      ) {
        return {
          type: "error",
          message: `Insufficient quantity of ${product.name} in inventory.`,
        };
      }
    }
  }

  const invoice = await db.invoice.findUnique({
    where: {
      id: data.id,
    },
  });

  if (invoice?.type === "Invoice") {
    // Merge all the same products and sum the quantity
    let materials: Material[] = [];

    for (const item in data.items) {
      const itemMaterials = data.items[item].materials;

      if (itemMaterials) {
        // @ts-ignore
        materials = [...materials, ...itemMaterials];
      }
    }

    const productsWithQuantity = materials.reduce(
      (acc: { id: number; quantity: number }[], material) => {
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

        // Fetch old materials associated with the invoice and product
        const oldMaterials = await db.material.findMany({
          where: {
            invoiceId: data.id,
            productId: product.id,
          },
        });

        // Calculate the old quantity of materials
        const oldQuantity = oldMaterials.reduce((acc, material) => {
          return acc + material.quantity!;
        }, 0);

        console.log("old quantity: ", oldQuantity);
        console.log("new quantity: ", product.quantity);

        // Calculate the difference in quantity
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
  }

  // Recalculate the profit
  const totalCost = data.items.reduce((acc, item) => {
    const materials = item.materials;
    const labor = item.labor;

    const materialCost = materials.reduce((acc, material) => {
      return acc + Number(material?.cost) * Number(material?.quantity);
    }, 0);

    const laborCost = Number(labor?.charge) * Number(labor?.hours);

    return acc + materialCost + laborCost;
  }, 0);

  // Update the invoice itself
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

  // Get existing photos
  const previousPhotos = await db.invoicePhoto.findMany({
    where: {
      invoiceId: data.id,
    },
  });

  // Remove the files
  previousPhotos.forEach(async (photo) => {
    const photoPath = `images/uploads/${photo.photo}`;
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
  });

  // Delete existing photos
  await db.invoicePhoto.deleteMany({
    where: {
      invoiceId: data.id,
    },
  });

  // Create new photos
  data.photos.forEach(async (photo) => {
    await db.invoicePhoto.create({
      data: {
        invoiceId: data.id,
        photo,
      },
    });
  });

  // Delete existing items
  await db.invoiceItem.deleteMany({
    where: {
      invoiceId: data.id,
    },
  });

  // Create new items, materials, labor, and tags associated with the invoice
  data.items.forEach(async (item) => {
    const service = item.service;
    const materials = item.materials;
    const labor = item.labor;
    const tags = item.tags;

    let laborId;
    // Delete existing labors
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
      }
    }

    // Create new labor
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

    // Create new items
    const invoiceItem = await db.invoiceItem.create({
      data: {
        invoiceId: data.id,
        serviceId: service?.id,
        laborId,
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

  // Create or update tasks associated with the invoice
  data.tasks.forEach(async (task) => {
    // If task.id is undefined, create a new task
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
      // If task.id is not undefined, update the task
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

  // Revalidate the path to update the cache
  revalidatePath("/estimate");

  return {
    type: "success",
    data: updatedInvoice,
  };
}
