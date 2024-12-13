"use server";

import { db } from "@/lib/db";
import { auth } from "../../app/auth";
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

/**
 * Adds a new customer to the database.
 *
 * @param data - The new customer data.
 * @returns A promise that resolves to a ServerAction indicating the result.
 */
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
    // Validate the data
    CustomerSchema.parse(data);

    // Authenticate the user and get the session
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    // Create a new customer in the database
    const newCustomer = await db.client.create({
      data: {
        ...data,
        companyId,
        photo: data.photo ? data.photo : undefined,
      },
    });

    // Revalidate the path to update the cache
    revalidatePath("/client");

    // Return a success action with the new customer data
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
