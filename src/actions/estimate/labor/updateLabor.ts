"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateLabor({
  id,
  name,
  categoryId,
  tags,
  notes,
  hours,
  charge,
  discount,
  addToCannedLabor = true,
}: {
  id: number;
  name: string;
  categoryId?: number;
  tags?: Tag[];
  notes?: string;
  hours?: number;
  charge?: number;
  discount?: number;
  addToCannedLabor?: boolean;
}): Promise<ServerAction> {
  const updatedLabor = await db.labor.update({
    where: { id },
    data: {
      name,
      categoryId,
      notes,
      hours,
      charge,
      discount,
      addToCannedLabor,
    },
  });

  // delete all labor tags
  await db.laborTag.deleteMany({
    where: {
      laborId: id,
    },
  });

  // create labor tags
  if (tags) {
    await Promise.all(
      tags.map((tag) =>
        db.laborTag.create({
          data: {
            laborId: id,
            tagId: tag.id,
          },
        }),
      ),
    );
  }

  const updatedLaborTags = await db.laborTag.findMany({
    where: {
      laborId: id,
    },
    include: {
      tag: true,
    },
  });

  revalidatePath("/estimate");

  return {
    type: "success",
    data: {
      ...updatedLabor,
      tags: updatedLaborTags.map((tag) => tag.tag),
    },
  };
}
