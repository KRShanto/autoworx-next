"use server";

import { ServerAction } from "@/types/action";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

/**
 * Creates a new service in the database.
 *
 * @param {Object} params - The parameters for creating the service.
 * @param {string} params.name - The name of the new service.
 * @param {number} [params.categoryId] - The category ID of the new service (optional).
 * @param {string} [params.description] - The description of the new service (optional).
 * @returns {Promise<ServerAction>} The result of the creation operation.
 */
export default async function newService({
  name,
  categoryId,
  description,
}: {
  name: string;
  categoryId?: number;
  description?: string;
}): Promise<ServerAction> {
  // Authenticate the user and get the session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Create the new service in the database
  const newService = await db.service.create({
    data: {
      companyId,
      name,
      categoryId,
      description,
    },
  });

  // Revalidate the cache for the "/estimate" path
  revalidatePath("/estimate");

  // Return the result of the creation operation
  return {
    type: "success",
    data: newService,
  };
}
