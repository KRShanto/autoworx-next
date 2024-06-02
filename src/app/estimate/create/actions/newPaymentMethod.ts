"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";

export async function newPaymentMethod(name: string): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

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
}
