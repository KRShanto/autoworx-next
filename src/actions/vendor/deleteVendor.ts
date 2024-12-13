"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Deletes a vendor from the database.
 *
 * @param {number} id - The ID of the vendor to delete.
 * @returns {Promise<ServerAction>} The result of the server action.
 */
export async function deleteVendor(id: number): Promise<ServerAction> {
  // Delete the vendor from the database
  await db.vendor.delete({
    where: {
      id,
    },
  });

  // Revalidate the vendor inventory path to update the cache
  revalidatePath("/inventory/vendor");

  return {
    type: "success",
  };
}
