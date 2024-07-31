"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";

export async function updateTemplate({
  id,
  subject,
  message,
}: {
  id: number;
  subject: string;
  message: string;
}): Promise<ServerAction> {
  await db.emailTemplate.update({
    where: { id },
    data: { subject, message },
  });

  return {
    type: "success",
  };
}
