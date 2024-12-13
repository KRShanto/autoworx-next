"use server";

import { ServerAction } from "@/types/action";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";

/**
 * Adds a new category to the database.
 *
 * @param name - The name of the new category.
 * @returns A promise that resolves to a ServerAction indicating the result.
 */
export default async function newCategory({
  name,
}: {
  name: string;
}): Promise<ServerAction> {
  // Authenticate the user and get the session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Create a new category in the database
  const newCategory = await db.category.create({
    data: {
      companyId,
      name,
    },
  });

  // Return a success action with the new category data
  return {
    type: "success",
    data: newCategory,
  };
}
