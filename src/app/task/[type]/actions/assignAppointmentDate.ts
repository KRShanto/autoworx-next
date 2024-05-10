"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function assignAppointmentDate({
  id,
  date,
  startTime,
  endTime,
}: {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}) {
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

  return;
}
