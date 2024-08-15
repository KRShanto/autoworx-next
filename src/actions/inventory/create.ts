"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
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

export async function createProduct(
  data: z.infer<typeof CreateProductInputSchema>,
): Promise<ServerAction> {
  try {
    const validatedData = CreateProductInputSchema.parse(data);

    const companyId = await getCompanyId();

    const newProduct = await db.inventoryProduct.create({
      data: {
        ...validatedData,
        companyId,
      },
    });

    const vendor = newProduct.vendorId
      ? await db.vendor.findUnique({
          where: { id: newProduct.vendorId },
        })
      : null;

    // create a history record
    await db.inventoryProductHistory.create({
      data: {
        productId: newProduct.id,
        date: new Date(),
        quantity: newProduct.quantity || 1,
        type: "Purchase",
        price: newProduct.price,
        vendorId: newProduct.vendorId ? newProduct.vendorId : null,
      },
    });

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
