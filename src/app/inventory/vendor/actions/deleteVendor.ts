"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteVendor(id: number): Promise<ServerAction> {
  await db.vendor.delete({
    where: {
      id,
    },
  });

  revalidatePath("/inventory/vendor");

  return {
    type: "success",
  };
}
