"use server";

import { db } from "@/lib/db";

export async function updateTemplate({
  id,
  subject,
  message,
}: {
  id: number;
  subject: string;
  message: string;
}) {
  await db.emailTemplate.update({
    where: { id },
    data: { subject, message },
  });

  return true;
}
