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

export async function updatePayment({
  id,
  type,
  date,
  notes,
  amount,
  additionalData,
}: PaymentData): Promise<ServerAction> {
  let updatedPayment;

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

  revalidatePath("/estimate");

  return { type: "success", data: updatedPayment };
}
