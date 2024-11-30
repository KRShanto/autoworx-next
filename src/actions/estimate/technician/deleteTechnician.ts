"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { updateWorkOrderStatus } from "./updateWorkOrderStatus";
import { revalidatePath } from "next/cache";

export async function deleteTechnician({
  id,
  invoiceId,
}: {
  id: number;
  invoiceId: string;
}): Promise<ServerAction> {
  await db.technician.delete({
    where: {
      id,
    },
  });

  await updateWorkOrderStatus(invoiceId);
  revalidatePath("/estimate/view");

  return { type: "success" };
}
