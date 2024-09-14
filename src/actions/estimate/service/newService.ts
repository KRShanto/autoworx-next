"use server";

import { ServerAction } from "@/types/action";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

export default async function newService({
  name,
  categoryId,
  description,
}: {
  name: string;
  categoryId?: number;
  description?: string;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newService = await db.service.create({
    data: {
      companyId,
      name,
      categoryId,
      description,
    },
  });

  revalidatePath("/estimate");

  return {
    type: "success",
    data: newService,
  };
}
