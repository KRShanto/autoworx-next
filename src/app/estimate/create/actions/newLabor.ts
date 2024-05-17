"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";

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
  tags?: string;
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
      tags,
      notes,
      hours,
      charge,
      discount,
      addToCannedLabor,
      companyId,
    },
  });

  return {
    type: "success",
    data: newLabor,
  };
}
