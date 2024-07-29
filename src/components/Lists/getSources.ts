"use server";

import { Source } from "@prisma/client";
import { db } from "@/lib/db";

export async function getSources() {
  return db.source.findMany();
}
