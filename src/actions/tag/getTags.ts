"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function getTags(): Promise<ServerAction> {
  const companyId = await getCompanyId();

  const tags = await db.tag.findMany({
    where: {
      companyId,
    },
  });

  return {
    type: "success",
    data: tags,
  };
}
