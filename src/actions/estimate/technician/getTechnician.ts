"use server";

import { db } from "@/lib/db";

export async function getTechnician(id: number) {
  const technician = await db.technician.findUnique({
    where: {
      id,
    },
  });

  return technician;
}
