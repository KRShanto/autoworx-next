"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function deleteAppointment(id: number): Promise<ServerAction> {
  await db.appointment.delete({
    where: {
      id,
    },
  });

  revalidatePath("/task");

  return {
    type: "success",
  };
}
