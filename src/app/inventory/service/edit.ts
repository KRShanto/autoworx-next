"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const ServiceSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
  discount: z.number(),
  total: z.number(),
});

export async function editService(data: {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}) {
  try {
    ServiceSchema.parse(data);

    await db.service.update({
      where: { id: data.id },
      data,
    });

    revalidatePath("/inventory/service");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    } else {
      return {
        message: "Something went wrong",
        field: "server",
      };
    }
  }
}
