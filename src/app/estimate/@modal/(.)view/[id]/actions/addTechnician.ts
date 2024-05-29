"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Priority } from "@prisma/client";

interface AddTechnicianInput {
  invoiceItemId: number;
  assignedBy?: string;
  assignedDate?: Date;
  due?: Date;
  amount?: number;
  priority?: Priority;
  statusId?: number;
  newNote?: string;
  workNote?: string;
}

export async function addTechnician(
  data: AddTechnicianInput,
): Promise<ServerAction> {
  const newTechnician = await db.technician.create({
    data,
  });

  return { type: "success", data: newTechnician };
}
