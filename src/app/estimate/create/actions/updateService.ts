"use server";

import { Labor, Material } from "@prisma/client";
import { db } from "@/lib/db";

export async function updateService({
  id,
  material,
  labor,
}: {
  id: number;
  material?: Material;
  labor?: Labor;
}) {
  await db.service.update({
    where: { id },
    data: {
      materialId: material?.id,
      laborId: labor?.id,
    },
  });

  return {
    type: "success",
  };
}
