"use server";

import { createProduct } from "@/actions/inventory/create";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { InventoryProduct, Material, Tag } from "@prisma/client";

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

  // create material tags
  // TODO: skip this for now
  // if (tags && newMaterial) {
  //   await Promise.all(
  //     tags.map((tag) =>
  //       db.materialTag.create({
  //         data: {
  //           materialId: newMaterial.id,
  //           tagId: tag.id,
  //         },
  //       }),
  //     ),
  //   );
  // }

  const newMaterialTags = await db.materialTag.findMany({
    where: {
      materialId: newMaterial?.id,
    },
    include: { tag: true },
  });

  return {
    type: "success",
    data: {
      ...newMaterial,
      tags: newMaterialTags.map((materialTag) => materialTag.tag),
    },
  };
}
