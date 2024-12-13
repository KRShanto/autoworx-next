"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";

/**
 * Creates a new payment method for the authenticated user's company.
 *
 * @param {string} name - The name of the new payment method.
 * @returns {Promise<ServerAction>} - The result of the creation operation.
 */
export async function newPaymentMethod(name: string): Promise<ServerAction> {
  // Get the authenticated user's session
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;

  // Create the new payment method in the database
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
