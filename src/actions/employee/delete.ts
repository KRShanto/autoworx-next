"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Delete an employee by ID.
 *
 * @param id - The ID of the employee to delete.
 * @returns A success message.
 */
export async function deleteEmployee(id: number) {
  // Delete the employee from the database
  await db.user.delete({
    where: {
      id,
    },
  });

  // Revalidate the employee page
  revalidatePath("/employee");

  // Return a success message
  return { type: "success", message: "Employee deleted successfully" };
}
