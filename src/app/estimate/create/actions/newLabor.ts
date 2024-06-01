"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";

export async function newLabor({
  name,
  categoryId,
  tags,
  notes,
  hours,
  charge,
  discount,
  addToCannedLabor = true,
}: {
  name: string;
  categoryId?: number;
  tags?: Tag[];
  notes?: string;
  hours?: number;
  charge?: number;
  discount?: number;
  addToCannedLabor?: boolean;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session?.user?.companyId;

  const newLabor = await db.labor.create({
    data: {
      name,
      categoryId,
      notes,
      hours,
      charge,
      discount,
      addToCannedLabor,
      companyId,
    },
  });

  // create labor tags
  if (tags) {
    await Promise.all(
      tags.map((tag) =>
        db.laborTag.create({
          data: {
            laborId: newLabor.id,
            tagId: tag.id,
          },
        }),
      ),
    );
  }

  const newLaborTags = await db.laborTag.findMany({
    where: {
      laborId: newLabor.id,
    },
    include: {
      tag: true,
    },
  });

  return {
    type: "success",
    data: {
      ...newLabor,
      tags: newLaborTags.map((tag) => tag.tag),
    },
  };
}
