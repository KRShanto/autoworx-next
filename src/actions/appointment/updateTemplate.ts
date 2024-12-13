"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

/**
 * Updates an email template in the database based on the provided data.
 *
 * @param id - The unique identifier of the email template to update.
 * @param subject - The new subject of the email template.
 * @param message - The new message of the email template.
 * @returns An object of type ServerAction indicating the result of the operation.
 */
export async function updateTemplate({
  id,
  subject,
  message,
}: {
  id: number;
  subject: string;
  message: string;
}): Promise<ServerAction> {
  // Update the email template in the database
  await db.emailTemplate.update({
    where: { id },
    data: { subject, message },
  });

  // Return an object signaling a successful action
  return {
    type: "success",
  };
}
