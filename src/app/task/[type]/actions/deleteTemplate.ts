"use server";

import { db } from "@/lib/db";

export async function deleteTemplate(id: number) {
  await db.emailTemplate.delete({
    where: {
      id,
    },
  });

  return;
}
