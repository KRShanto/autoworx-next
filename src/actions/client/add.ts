"use server";

import { db } from "@/lib/db";
import { auth } from "../../app/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { AuthSession } from "@/types/auth";
import { Source, Tag } from "@prisma/client";
import { ServerAction } from "@/types/action";
import { createClientValidationSchema } from "@/validations/schemas/client/client.validation";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { TErrorHandler } from "@/types/globalError";

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
}): Promise<ServerAction | TErrorHandler> {
  try {
    await createClientValidationSchema.parseAsync(data);

    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    const newCustomer = await db.client.create({
      data: {
        ...data,
        companyId,
        photo: data.photo ? data.photo : undefined,
      },
    });

    revalidatePath("/client");

    return { type: "success", data: newCustomer };
  } catch (error: any) {
    return errorHandler(error);
  }
}
