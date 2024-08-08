"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteEmployee(id: number) {
  await db.user.delete({
    where: {
      id,
    },
  });

  revalidatePath("/employee");

  return { type: "success", message: "Employee deleted successfully" };
}
