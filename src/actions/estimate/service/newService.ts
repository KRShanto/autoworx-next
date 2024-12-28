"use server";

import { ServerAction } from "@/types/action";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { serviceCreateValidationSchema } from "@/validations/schemas/estimate/service/service.validation";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { TErrorHandler } from "@/types/globalError";

export default async function newService({
  name,
  categoryId,
  description,
}: {
  name: string;
  categoryId?: number;
  description?: string;
}): Promise<ServerAction | TErrorHandler> {
  try {
    const validatedServiceInfo = await serviceCreateValidationSchema.parseAsync(
      {
        name,
        categoryId,
        description,
      },
    );
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;

    const newService = await db.service.create({
      data: {
        companyId,
        ...validatedServiceInfo,
      },
    });
    
    revalidatePath("/estimate");

    return {
      type: "success",
      data: newService,
    };
  } catch (err) {
    return errorHandler(err);
  }
}
