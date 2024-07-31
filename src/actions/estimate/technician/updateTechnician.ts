"use server";

import { db } from "@/lib/db";
import { Technician } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateTechnician = async (
  technicianId: number,
  payload: Technician,
) => {
  try {
    if (!payload) {
      return { type: "error", message: "Invalid payload" };
    }
    await db.technician.update({
      where: { id: technicianId },
      data: payload,
    });
    revalidatePath("/estimate");
    return { type: "success" };
  } catch (err) {
    throw err;
  }
};
