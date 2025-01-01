"use server";

import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { TErrorHandler } from "@/types/globalError";
import {
  replenishProductValidationSchema,
  TReplenishProductValidation,
} from "@/validations/schemas/inventory/replenishProduct.validation";
import { revalidatePath } from "next/cache";

export async function replenish({
  productId,
  date,
  vendorId,
  quantity,
  price,
  unit,
  lot,
  notes,
}: TReplenishProductValidation): Promise<ServerAction | TErrorHandler> {
  try {
    console.log({
      productId,
      date,
      vendorId,
      quantity,
      price,
      unit,
      lot,
      notes,
    });
    await replenishProductValidationSchema.parseAsync({
      productId,
      date,
      vendorId,
      quantity,
      price,
      unit,
      lot,
      notes,
    });
    const companyId = await getCompanyId();

    const product = await db.inventoryProduct.findUnique({
      where: { id: productId },
    });

    const vendor = vendorId
      ? await db.vendor.findUnique({
          where: { id: vendorId },
        })
      : null;

    const newHistory = await db.inventoryProductHistory.create({
      data: {
        companyId,
        productId,
        date,
        quantity,
        notes,
        type: "Purchase",
        price: price || product?.price,
        vendorId: vendor?.id,
      },
    });

    // update product quantity
    const newQuantity = product!.quantity! + quantity;

    await db.inventoryProduct.update({
      where: { id: productId },
      data: {
        quantity: newQuantity,
        price: price || product?.price,
        unit: unit || product?.unit,
        lot: lot || product?.lot,
      },
    });

    revalidatePath("/inventory");

    return {
      type: "success",
      data: newHistory,
    };
  } catch (error) {
    return errorHandler(error);
  }
}
