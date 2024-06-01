"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { Tag } from "@prisma/client";

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
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newMaterial = await db.material.create({
    data: {
      name,
      categoryId,
      vendorId,
      notes,
      quantity,
      cost,
      sell,
      discount,
      addToInventory,
      companyId,
    },
  });

  // create material tags
  if (tags) {
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
  }

  const newMaterialTags = await db.materialTag.findMany({
    where: {
      materialId: newMaterial.id,
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
