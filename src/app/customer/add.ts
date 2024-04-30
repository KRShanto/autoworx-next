"use server";

import { db } from "@/lib/db";
import { auth } from "../auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { AuthSession } from "@/types/auth";

const CustomerSchema = z.object({
  firstName: z.string(),
  email: z.string().email().nullable(),
});

export async function addCustomer(data: {
  firstName: string;
  lastName?: string;
  email?: string;
  mobile?: number;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  customerCompany?: string;
  tag?: string;
  image?: string;
}) {
  try {
    CustomerSchema.parse(data);

    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    const newCustomer = await db.customer.create({
      data: {
        ...data,
        companyId,
      },
    });

    revalidatePath("/customer");

    return newCustomer;
  } catch (error: any) {
    console.log(error);

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
