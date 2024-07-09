"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function assignAppointmentDate({
  id,
  date,
  startTime,
  endTime,
}: {
  id: number;
  date: Date | string;
  startTime: string;
  endTime: string;
}): Promise<ServerAction> {
  await db.appointment.update({
    where: {
      id,
    },
    data: {
      date: new Date(date),
      startTime,
      endTime,
    },
  });

  revalidatePath("/task");

  return {
    type: "success",
  };
}
