"use server";

import { Source } from "@prisma/client";
import { db } from "@/lib/db";

export async function deleteSource(id: number) {
  return db.source.delete({
    where: { id },
  });
}
