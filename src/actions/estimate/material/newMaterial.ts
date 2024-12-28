"use server";

import { createProduct } from "@/actions/inventory/create";
import { auth } from "@/app/auth";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { TErrorHandler } from "@/types/globalError";
import { materialCreateValidationSchema } from "@/validations/schemas/estimate/material/material.validation";
import { InventoryProduct, Material, Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ValidationRequestInstance } from "twilio/lib/rest/api/v2010/account/validationRequest";

export async function newMaterial({
  name,
  categoryId,
  vendorId,
  tags,
  notes,
  quantity,
  cost,
  sell,
  discount,
  addToInventory,
}: {
  name: string;
  categoryId?: number;
  vendorId?: number;
  tags?: Tag[];
  notes?: string;
  quantity?: number;
  cost?: number;
  sell?: number;
  discount?: number;
  addToInventory?: boolean;
}): Promise<ServerAction | TErrorHandler> {
  try {
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;
    let newMaterial: Material | InventoryProduct | null = null;
    let newMaterialTags: { tag: Tag }[] = [];
    const validatedNewMaterialData =
      await materialCreateValidationSchema.parseAsync({
        name,
        categoryId,
        vendorId,
        notes,
        quantity,
        tags,
        cost,
        sell,
        discount,
        addToInventory,
      });

    if (addToInventory) {
      const res = await createProduct({
        name: validatedNewMaterialData.name,
        categoryId: validatedNewMaterialData.categoryId,
        vendorId: validatedNewMaterialData.vendorId,
        description: validatedNewMaterialData.notes,
        quantity: validatedNewMaterialData.quantity || 1,
        price: validatedNewMaterialData.cost || 0,
        type: "Product",
      });

      if (res.type === "error") {
        return res;
      } else {
        newMaterial = res.data;
      }
    } else {
      newMaterial = await db.material.create({
        data: {
          name: validatedNewMaterialData.name,
          categoryId: validatedNewMaterialData.categoryId,
          vendorId: validatedNewMaterialData.vendorId,
          notes: validatedNewMaterialData.notes,
          quantity: validatedNewMaterialData.quantity,
          cost: validatedNewMaterialData.cost,
          sell: validatedNewMaterialData.sell,
          discount: validatedNewMaterialData.discount,
          companyId,
        },
      });
    }

    // create inventory tags
    if (tags && newMaterial) {
      if (addToInventory) {
        await Promise.all(
          tags.map((tag) =>
            db.inventoryProductTag.create({
              data: {
                inventoryId: newMaterial?.id,
                tagId: tag.id,
              },
            }),
          ),
        );

        newMaterialTags = await db.inventoryProductTag.findMany({
          where: {
            inventoryId: newMaterial?.id,
          },
          include: { tag: true },
        });
      } else {
        await Promise.all(
          tags.map((tag) =>
            db.materialTag.create({
              data: {
                materialId: newMaterial?.id,
                tagId: tag.id,
              },
            }),
          ),
        );

        newMaterialTags = await db.materialTag.findMany({
          where: {
            materialId: newMaterial?.id,
          },
          include: { tag: true },
        });
      }
    }

    revalidatePath("/estimate");

    return {
      type: "success",
      data: {
        ...newMaterial,
        tags: newMaterialTags.map((materialTag) => materialTag.tag),
      },
    };
  } catch (error) {
    return errorHandler(error);
  }
}
