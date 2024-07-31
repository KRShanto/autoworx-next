"use server";

import { ServerAction } from "@/types/action";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";

export default async function newCategory({
  name,
}: {
  name: string;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newCategory = await db.category.create({
    data: {
      companyId,
      name,
    },
  });

  return {
    type: "success",
    data: newCategory,
  };
}
