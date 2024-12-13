"use server";

import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Fetches all tags associated with the current company.
 * @returns An object containing the status and an array of tags.
 */
export async function getTags(): Promise<ServerAction> {
  const companyId = await getCompanyId(); // Get the current company ID

  // Query the database to find all tags associated with the company ID
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
