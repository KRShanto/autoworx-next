"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Deletes an email template from the database based on the provided ID.
 * Utilizes the Prisma client to perform the deletion operation asynchronously.
 *
 * @param id - The unique identifier of the email template to delete.
 * @returns An object of type ServerAction indicating the result of the operation.
 */
export async function deleteTemplate(id: number): Promise<ServerAction> {
  try {
    // Invoke the delete method on the emailTemplate model with the specified ID
    await db.emailTemplate.delete({
      where: {
        id, // The ID of the email template to be deleted
      },
    });

    // Return an object signaling a successful action
    return {
      type: "success",
    };
  } catch (error) {
    console.error("Error deleting template:", error);
    return { type: "error", message: "Failed to delete the template." };
  }
}
