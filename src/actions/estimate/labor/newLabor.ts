"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function newLabor({
  name,
  categoryId,
  tags,
  notes,
  hours,
  charge,
  discount,
  cannedLabor,
}: {
  name: string;
  categoryId?: number;
  tags?: Tag[];
  notes?: string;
  hours?: number;
  charge?: number;
  discount?: number;
  cannedLabor?: boolean;
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
      companyId,
      cannedLabor
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

  revalidatePath("/estimate");

  return {
    type: "success",
    data: {
      ...newLabor,
      tags: newLaborTags.map((tag) => tag.tag),
    },
  };
}
