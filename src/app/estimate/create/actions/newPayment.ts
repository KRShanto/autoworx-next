"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { CardType, PaymentType } from "@prisma/client";

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
  type: PaymentType;
  date: string;
  notes: string;
  additionalData:
    | CardPaymentData
    | CheckPaymentData
    | CashPaymentData
    | OtherPaymentData;
}

export async function newPayment({
  type,
  date,
  notes,
  additionalData,
}: PaymentData): Promise<ServerAction> {
  let newPayment;

  switch (type) {
    case "CARD":
      newPayment = await db.payment.create({
        data: {
          date: new Date(date),
          notes: notes,
          type: "CARD",
          card: {
            create: {
              cardType: (additionalData as CardPaymentData).cardType,
              creditCard: (additionalData as CardPaymentData).creditCard,
            },
          },
        },
        include: {
          card: true,
        },
      });
      break;

    case "CHECK":
      newPayment = await db.payment.create({
        data: {
          date: new Date(date),
          notes: notes,
          type: "CHECK",
          check: {
            create: {
              checkNumber: (additionalData as CheckPaymentData).checkNumber,
            },
          },
        },
        include: {
          check: true,
        },
      });
      break;

    case "CASH":
      newPayment = await db.payment.create({
        data: {
          date: new Date(date),
          notes: notes,
          type: "CASH",
          cash: {
            create: {
              receivedCash: (additionalData as CashPaymentData).receivedCash,
            },
          },
        },
        include: {
          cash: true,
        },
      });
      break;

    case "OTHER":
      newPayment = await db.payment.create({
        data: {
          date: new Date(date),
          notes: notes,
          type: "OTHER",
          other: {
            create: {
              paymentMethodId: (additionalData as OtherPaymentData)
                .paymentMethodId,
              amount: (additionalData as OtherPaymentData).amount,
            },
          },
        },
        include: {
          other: true,
        },
      });
      break;

    default:
      return {
        type: "error",
        message: "Invalid payment type",
      };
  }

  return {
    type: "success",
    message: "Payment created",
    data: newPayment,
  };
}
