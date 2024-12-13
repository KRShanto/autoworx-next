"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";

/**
 * Deletes a tag by its ID.
 * @param id - The ID of the tag to delete.
 * @returns An object containing the status of the action.
 */
export async function deleteTag(id: number): Promise<ServerAction> {
  // Delete the tag from the database
  await db.tag.delete({
    where: {
      id,
    },
  });

  return {
    type: "success",
  };
}
