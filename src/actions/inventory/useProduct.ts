"use server";

import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { TErrorHandler } from "@/types/globalError";
import { lossProductValidationSchema, TLossProductValidation } from "@/validations/schemas/inventory/useProduct.validation";
import { revalidatePath } from "next/cache";

export async function useProduct({
  productId,
  invoiceId,
  date,
  quantity,
  notes,
}: TLossProductValidation): Promise<ServerAction | TErrorHandler> {
  try {
    await lossProductValidationSchema.parseAsync({
      productId,
      invoiceId,
      date,
      quantity,
      notes,
    });

    const companyId = await getCompanyId();
    // update product quantity
    const product = await db.inventoryProduct.findUnique({
      where: { id: productId },
      include: { vendor: true },
    });

    const newHistory = await db.inventoryProductHistory.create({
      data: {
        companyId,
        productId,
        invoiceId,
        date,
        quantity,
        notes,
        type: "Sale",
        price: product?.price,
        vendorId: product?.vendor?.id,
      },
    });

    const newQuantity = product!.quantity! - quantity;

    await db.inventoryProduct.update({
      where: { id: productId },
      data: { quantity: newQuantity },
    });

    revalidatePath("/inventory");

    return {
      type: "success",
      data: newHistory,
    };
  } catch (err) {
    return errorHandler(err);
  }
}
