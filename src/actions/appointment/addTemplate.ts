"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { EmailTemplateType } from "@prisma/client";

/**
 * Adds a new email template to the database.
 *
 * @param subject - The subject of the email template.
 * @param message - The message of the email template.
 * @param type - The type of the email template.
 * @returns A promise that resolves to a ServerAction indicating the result.
 */
export async function addTemplate({
  subject,
  message,
  type,
}: {
  subject: string;
  message: string;
  type: EmailTemplateType;
}): Promise<ServerAction> {
  // Authenticate the user and get the session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Create a new email template in the database
  const newTemplate = await db.emailTemplate.create({
    data: {
      subject,
      message,
      type,
      companyId,
    },
  });

  // Return a success action with the new template data
  return {
    type: "success",
    data: newTemplate,
  };
}
