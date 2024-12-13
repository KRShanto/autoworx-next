"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { CardType, PaymentType } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CardPaymentData {
  creditCard?: string;
  cardType: CardType;
}

interface CheckPaymentData {
  checkNumber?: string;
}

interface CashPaymentData {
  receivedCash?: number;
}

interface OtherPaymentData {
  paymentMethodId?: number;
  amount?: number;
}

interface PaymentData {
  id: number;
  type: PaymentType;
  date: Date;
  notes: string;
  amount: number;
  additionalData:
    | CardPaymentData
    | CheckPaymentData
    | CashPaymentData
    | OtherPaymentData;
}

/**
 * Updates an existing payment record in the database.
 *
 * @param {PaymentData} paymentData - The payment data to update.
 * @returns {Promise<ServerAction>} - The result of the update operation.
 */
export async function updatePayment({
  id,
  type,
  date,
  notes,
  amount,
  additionalData,
}: PaymentData): Promise<ServerAction> {
  let updatedPayment;

  // Determine the type of payment and update accordingly
  switch (type) {
    case "CARD":
      updatedPayment = await db.payment.update({
        where: { id },
        data: {
          date: new Date(date),
          notes,
          amount,
          card: {
            update: {
              cardType: (additionalData as CardPaymentData).cardType,
              creditCard: (additionalData as CardPaymentData).creditCard,
            },
          },
        },
      });
      break;

    case "CHECK":
      updatedPayment = await db.payment.update({
        where: { id },
        data: {
          date: new Date(date),
          notes,
          amount,
          check: {
            update: {
              checkNumber: (additionalData as CheckPaymentData).checkNumber,
            },
          },
        },
      });
      break;

    case "CASH":
      updatedPayment = await db.payment.update({
        where: { id },
        data: {
          date: new Date(date),
          notes,
          amount,
          cash: {
            update: {
              receivedCash: (additionalData as CashPaymentData).receivedCash,
            },
          },
        },
      });
      break;

    case "OTHER":
      updatedPayment = await db.payment.update({
        where: { id },
        data: {
          date: new Date(date),
          notes,
          amount,
          other: {
            update: {
              paymentMethodId: (additionalData as OtherPaymentData)
                .paymentMethodId,
            },
          },
        },
      });
      break;

    default:
      throw new Error("Invalid payment type");
  }

  // Update the associated invoice
  const invoice = await db.invoice.findUnique({
    where: { id: updatedPayment.invoiceId! },
  });

  await db.invoice.update({
    where: { id: invoice!.id },
    data: {
      // @ts-ignore
      due: (invoice!.due || 0) - (updatedPayment.amount || 0),
    },
  });

  // Revalidate the path to ensure the changes are reflected
  revalidatePath("/estimate");

  return { type: "success", data: updatedPayment };
}
