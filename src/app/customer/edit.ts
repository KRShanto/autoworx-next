"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.number(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
});

export async function editCustomer(data: {
  id: number;
  name: string;
  email: string;
  mobile: number;
  address: string;
  city: string;
  state: string;
  zip: string;
}) {
  try {
    CustomerSchema.parse(data);

    await db.customer.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/customer");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    } else {
      return {
        message: error.message,
        field: "all",
      };
    }
  }
}
