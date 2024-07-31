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
  additionalData:
    | CardPaymentData
    | CheckPaymentData
    | CashPaymentData
    | OtherPaymentData;
}

export async function updatePayment({
  id,
  type,
  date,
  notes,
  additionalData,
}: PaymentData): Promise<ServerAction> {
  let updatedPayment;

  switch (type) {
    case "CARD":
      updatedPayment = await db.payment.update({
        where: { id },
        data: {
          date: new Date(date),
          notes: notes,
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
          notes: notes,
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
          notes: notes,
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
          notes: notes,
          other: {
            update: {
              paymentMethodId: (additionalData as OtherPaymentData)
                .paymentMethodId,
              amount: (additionalData as OtherPaymentData).amount,
            },
          },
        },
      });
      break;

    default:
      throw new Error("Invalid payment type");
  }

  revalidatePath("/estimate");

  return { type: "success", data: updatedPayment };
}
