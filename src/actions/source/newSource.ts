"use server";

// Import necessary modules and types
import { Source } from "@prisma/client";
import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import { ServerAction } from "@/types/action";

/**
 * Creates a new source for the authenticated user's company.
 *
 * @param {string} name - The name of the new source.
 * @returns {Promise<ServerAction>} The result of the source creation.
 */
export async function newSource(name: string): Promise<ServerAction> {
  // Get the company ID of the authenticated user
  const companyId = await getCompanyId();

  // Create a new source in the database
  const source = await db.source.create({
    data: {
      name,
      companyId,
    },
  });

  // Return the result of the source creation
  return {
    message: "Source added",
    type: "success",
    data: source,
  };
}
