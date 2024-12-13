"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

/**
 * Converts an invoice from Estimate to Invoice or vice versa.
 * @param id - The ID of the invoice to convert.
 * @returns A promise that resolves to a ServerAction indicating success or error.
 */
export async function convertInvoice(id: string): Promise<ServerAction> {
  const companyId = await getCompanyId();
  const invoice = await db.invoice.findUnique({ where: { id } });

  if (!invoice) {
    return { type: "error", message: "Invoice not found" };
  }

  // Get all the product materials
  const materials = await db.material.findMany({
    where: {
      invoiceId: id,
      // productId not null
      productId: { not: null },
    },
    include: {
      vendor: true,
      product: true, // Include the product to get its name
    },
  });

  // Merge all the same products and sum the quantity
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

  // If converting from Estimate to Invoice, check inventory quantities
  if (invoice.type === "Estimate") {
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
        // Get the product name
        const productName =
          materials.find((m) => m.productId === product.id)?.product?.name ||
          "Product";

        return {
          type: "error",
          message: `Insufficient quantity of ${productName} in inventory.`,
        };
      }
    }
  }

  // Now update the invoice type
  await db.invoice.update({
    where: { id },
    data: {
      type: invoice.type === "Estimate" ? "Invoice" : "Estimate",
    },
  });

  await Promise.all(
    productsWithQuantity.map(async (product) => {
      // Create a new history entry
      await db.inventoryProductHistory.create({
        data: {
          companyId,
          productId: product.id,
          date: new Date(),
          quantity: product.quantity,
          price: materials.find((m) => m.productId === product.id)?.sell,
          vendorId: materials.find((m) => m.productId === product.id)?.vendor
            ?.id!,
          type: "Sale",
          invoiceId: id,
        },
      });

      // NOTE: if its Estimate -> Invoice, we should decrement the quantity
      // if its Invoice -> Estimate, we should increment the quantity
      await db.inventoryProduct.update({
        where: {
          id: product.id,
        },
        data: {
          quantity: {
            increment:
              invoice.type === "Estimate"
                ? -product.quantity
                : product.quantity,
          },
        },
      });
    }),
  );

  return { type: "success", message: "Invoice converted" };
}
