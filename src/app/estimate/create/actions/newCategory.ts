"use server";

import { ServerAction } from "@/types/action";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { CategoryType } from "@prisma/client";

export default async function newCategory({
  name,
  type,
}: {
  name: string;
  type: CategoryType;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newCategory = await db.category.create({
    data: {
      companyId,
      name,
      type,
    },
  });

  return {
    type: "success",
    data: newCategory,
  };
}
