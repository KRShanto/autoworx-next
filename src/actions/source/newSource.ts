"use server";

import { Source } from "@prisma/client";
import { db } from "@/lib/db";
import { getCompanyId } from "@/lib/companyId";
import { ServerAction } from "@/types/action";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { TErrorHandler } from "@/types/globalError";
import { sourceValidationSchema } from "@/validations/schemas/client/source.validatin";

export async function newSource(
  name: string,
): Promise<ServerAction | TErrorHandler> {
  try {
    const companyId = await getCompanyId();
    await sourceValidationSchema.parseAsync({ name });

    const source = await db.source.create({
      data: {
        name,
        companyId,
      },
    });

    return {
      message: "Source added",
      type: "success",
      data: source,
    };
  } catch (err) {
    return errorHandler(err);
  }
}
