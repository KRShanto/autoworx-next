"use server";

import { db } from "@/lib/db";
import { auth } from "../auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { AuthSession } from "@/types/auth";

const CustomerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  mobile: z.number(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
});

export async function addCustomer(data: {
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

    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    await db.customer.create({
      data: {
        ...data,
        companyId,
      },
    });

    revalidatePath("/customer");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        field: error.errors[0].path[0],
      };
    } else if (error.code === "P2002") {
      return {
        message: "Mobile already exists",
        field: "mobile",
      };
    } else {
      return {
        message: error.message,
      };
    }
  }
}
