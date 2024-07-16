"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Technician } from "@prisma/client";
import { revalidatePath } from "next/cache";
type TechnicianInput = Technician;
export async function addTechnician(
  payload: TechnicianInput,
): Promise<ServerAction> {
  try {
    if (!payload) {
      return { type: "error", message: "Invalid payload" };
    }
    await db.technician.create({
      data: payload as TechnicianInput,
    });
    revalidatePath('/estimate')
    return { type: "success" };
  } catch (error) {
    throw error
  }
}
