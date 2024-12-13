"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { ServerAction } from "@/types/action";
import { InventoryProductType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateProductInputSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  categoryId: z.number().optional(),
  vendorId: z.number().optional(),
  quantity: z.number().nonnegative(),
  unit: z.string().optional(),
  lot: z.string().optional(),
  type: z.enum([InventoryProductType.Product, InventoryProductType.Supply]),
  receipt: z.string().optional(),
  lowInventoryAlert: z.number().optional(),
});

/**
 * Create a new product in the inventory.
 * @param {Object} data - The data for creating the product.
 * @returns {Promise<ServerAction>} The result of the action.
 */
export async function createProduct(
  data: z.infer<typeof CreateProductInputSchema>,
): Promise<ServerAction> {
  try {
    const user = await getUser();
    const validatedData = CreateProductInputSchema.parse(data);

    const companyId = await getCompanyId();

    // Create the new product in the database
    const newProduct = await db.inventoryProduct.create({
      data: {
        ...validatedData,
        companyId,
        userId: user.id,
      },
    });

    // Fetch the vendor if vendorId is provided
    const vendor = newProduct.vendorId
      ? await db.vendor.findUnique({
          where: { id: newProduct.vendorId },
        })
      : null;

    // Create a history record for the new product
    await db.inventoryProductHistory.create({
      data: {
        companyId,
        productId: newProduct.id,
        date: new Date(),
        quantity: newProduct.quantity || 1,
        type: "Purchase",
        price: newProduct.price,
        vendorId: newProduct.vendorId ? newProduct.vendorId : null,
      },
    });

    // Revalidate the inventory path
    revalidatePath("/inventory");

    return {
      type: "success",
      data: newProduct,
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: error.errors[0].message ?? "Invalid data",
        field: "all",
      };
    } else {
      return {
        type: "error",
        message: "An error occurred",
      };
    }
  }
}
