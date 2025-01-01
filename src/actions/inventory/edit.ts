"use server";

import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { TErrorHandler } from "@/types/globalError";
import {
  TUpdateProductValidation,
  updateProductValidationSchema,
} from "@/validations/schemas/inventory/inventoryProduct.validation";
import { revalidatePath } from "next/cache";

export async function editProduct({
  id,
  name,
  description,
  price,
  categoryId,
  vendorId,
  quantity,
  unit,
  lot,
  type,
  receipt,
  lowInventoryAlert,
}: TUpdateProductValidation): Promise<ServerAction | TErrorHandler> {
  try {
    await updateProductValidationSchema.parseAsync({
      id,
      name,
      description,
      price,
      categoryId,
      vendorId,
      quantity,
      unit,
      lot,
      type,
      receipt,
      lowInventoryAlert,
    });
    const updatedProduct = await db.inventoryProduct.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryId,
        vendorId,
        quantity,
        unit,
        lot,
        type,
        receipt,
        lowInventoryAlert,
      },
    });

    revalidatePath("/inventory");

    return {
      type: "success",
      data: updatedProduct,
    };
  } catch (error) {
    return errorHandler(error);
  }
}
