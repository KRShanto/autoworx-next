"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { EmailTemplateType } from "@prisma/client";

export async function addTemplate({
  subject,
  message,
  type,
}: {
  subject: string;
  message: string;
  type: EmailTemplateType;
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  const newTemplate = await db.emailTemplate.create({
    data: {
      subject,
      message,
      type,
      companyId,
    },
  });

  return newTemplate;
}
