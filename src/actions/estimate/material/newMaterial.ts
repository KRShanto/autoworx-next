"use server";

import { createProduct } from "@/actions/inventory/create";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { InventoryProduct, Material, Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  let newMaterial: Material | InventoryProduct | null = null;
  let newMaterialTags: { tag: Tag }[] = [];

  if (addToInventory) {
    const res = await createProduct({
      name,
      categoryId,
      vendorId,
      description: notes,
      quantity: quantity || 1,
      price: cost || 0,
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
        name,
        categoryId,
        vendorId,
        notes,
        quantity,
        cost,
        sell,
        discount,
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
              inventoryId: newMaterial.id,
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
              materialId: newMaterial.id,
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

  revalidatePath("/estimate")

  return {
    type: "success",
    data: {
      ...newMaterial,
      tags: newMaterialTags.map((materialTag) => materialTag.tag),
    },
  };
}
