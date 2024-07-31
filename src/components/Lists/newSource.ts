"use server";

import { Source } from "@prisma/client";
import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import { ServerAction } from "@/types/action";

export async function newSource(name: string): Promise<ServerAction> {
  const companyId = await getCompanyId();

  const source = await db.source.create({
    data: {
      name,
      companyId,
    },
  });

  return {
    message: "Source added",
    type: "success",
    data: source,
  };
}
