"use server";

import { auth } from "@/app/auth";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { TErrorHandler } from "@/types/globalError";
import { createNewPaymentMethodValidation } from "@/validations/schemas/payment/paymentMethod.validation";

export async function newPaymentMethod(
  name: string,
): Promise<ServerAction | TErrorHandler> {
  try {
    const session = (await auth()) as AuthSession;
    const companyId = session.user.companyId;
    await createNewPaymentMethodValidation.parseAsync(name)

    const paymentMethod = await db.paymentMethod.create({
      data: {
        name,
        companyId,
      },
    });

    return {
      type: "success",
      message: "Payment method created",
      data: paymentMethod,
    };
  } catch (err) {
    return errorHandler(err);
  }
}
