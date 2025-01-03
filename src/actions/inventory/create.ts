"use server";

import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { ServerAction } from "@/types/action";
import { TErrorHandler } from "@/types/globalError";
import { createProductValidationSchema, TCreateProductValidation } from "@/validations/schemas/inventory/inventoryProduct.validation";
import { revalidatePath } from "next/cache";

// const CreateProductInputSchema = z.object({
//   name: z.string().min(3),
//   description: z.string().optional(),
//   price: z.number().nonnegative(),
//   categoryId: z.number().optional(),
//   vendorId: z.number().optional(),
//   quantity: z.number().nonnegative(),
//   unit: z.string().optional(),
//   lot: z.string().optional(),
//   type: z.enum([InventoryProductType.Product, InventoryProductType.Supply]),
//   receipt: z.string().optional(),
//   lowInventoryAlert: z.number().optional(),
// });

export async function createProduct(
  data: TCreateProductValidation,
): Promise<ServerAction | TErrorHandler> {
  try {
    const user = await getUser();
    const validatedData = await createProductValidationSchema.parseAsync(data);

    const companyId = await getCompanyId();

    const newProduct = await db.inventoryProduct.create({
      data: {
        ...validatedData,
        companyId,
        userId: user.id,
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
        companyId,
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
  } catch (error) {
    return errorHandler(error);
  }
}
