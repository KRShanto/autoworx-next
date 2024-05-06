"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteAppointment(id: number) {
  await db.appointment.delete({
    where: {
      id,
    },
  });

  revalidatePath("/task");

  return;
}
