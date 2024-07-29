"use server";

import { db } from "@/lib/db";
import { auth } from "../auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { AuthSession } from "@/types/auth";
import { Source, Tag } from "@prisma/client";
import { ServerAction } from "@/types/action";

const CustomerSchema = z.object({
  // TODO: Add validation
  firstName: z.string(),
  email: z.string().email().nullable(),
});

export async function addCustomer(data: {
  firstName: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  customerCompany?: string;
  tagId?: number;
  photo?: string;
  sourceId?: number;
}): Promise<ServerAction> {
  try {
    CustomerSchema.parse(data);

    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    const newCustomer = await db.customer.create({
      data: {
        ...data,
        companyId,
        photo: `/uploads/${data.photo}`,
      },
    });

    console.log("New Customer", newCustomer);

    revalidatePath("/customer");

    return { type: "success", data: newCustomer };
  } catch (error: any) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        type: "error",
        field: error.errors[0].path[0] as string,
      };
    } else if (error.code === "P2002") {
      return {
        type: "error",
        message: "Mobile already exists",
        field: "mobile",
      };
    } else {
      return {
        type: "error",
        message: error.message,
      };
    }
  }
}
