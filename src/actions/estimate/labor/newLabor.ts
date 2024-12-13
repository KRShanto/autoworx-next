"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Creates a new labor entry in the database.
 *
 * @param {Object} params - The parameters for creating the labor.
 * @param {string} params.name - The name of the labor.
 * @param {number} [params.categoryId] - The category ID of the labor.
 * @param {Tag[]} [params.tags] - The tags associated with the labor.
 * @param {string} [params.notes] - Additional notes for the labor.
 * @param {number} [params.hours] - The number of hours for the labor.
 * @param {number} [params.charge] - The charge for the labor.
 * @param {number} [params.discount] - The discount for the labor.
 * @param {boolean} [params.cannedLabor] - Indicates if the labor is canned.
 * @returns {Promise<ServerAction>} The result of the creation operation.
 */
export async function newLabor({
  name,
  categoryId,
  tags,
  notes,
  hours,
  charge,
  discount,
  cannedLabor,
}: {
  name: string;
  categoryId?: number;
  tags?: Tag[];
  notes?: string;
  hours?: number;
  charge?: number;
  discount?: number;
  cannedLabor?: boolean;
}): Promise<ServerAction> {
  // Get the current session and company ID
  const session = (await auth()) as AuthSession;
  const companyId = session?.user?.companyId;

  // Create a new labor entry in the database
  const newLabor = await db.labor.create({
    data: {
      name,
      categoryId,
      notes,
      hours,
      charge,
      discount,
      companyId,
      cannedLabor,
    },
  });

  // Create tags for the new labor if provided
  if (tags) {
    await Promise.all(
      tags.map((tag) =>
        db.laborTag.create({
          data: {
            laborId: newLabor.id,
            tagId: tag.id,
          },
        }),
      ),
    );
  }

  // Retrieve the tags for the new labor
  const newLaborTags = await db.laborTag.findMany({
    where: {
      laborId: newLabor.id,
    },
    include: {
      tag: true,
    },
  });

  // Revalidate the cache for the estimate path
  revalidatePath("/estimate");

  // Return the result of the creation operation
  return {
    type: "success",
    data: {
      ...newLabor,
      tags: newLaborTags.map((tag) => tag.tag),
    },
  };
}
