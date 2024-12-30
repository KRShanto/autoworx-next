"use server";

import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { TErrorHandler } from "@/types/globalError";
import { createPaymentValidationSchema } from "@/validations/schemas/payment/payment.validation";
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
  invoiceId: string;
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

export async function newPayment({
  invoiceId,
  type,
  date,
  notes,
  amount,
  additionalData,
}: PaymentData): Promise<ServerAction | TErrorHandler> {
  try {
    const companyId = await getCompanyId();

    await createPaymentValidationSchema.parseAsync({
      invoiceId,
      type,
      date,
      notes,
      amount,
      additionalData,
    });

    // get all the product materials
    const materials = await db.material.findMany({
      where: {
        invoiceId,
        // productId not null
        productId: { not: null },
      },
      include: {
        vendor: true,
      },
    });

    // merge all the same products and sum the quantity
    const productsWithQuantity = materials.reduce(
      (acc: { id: number; quantity: number }[], material) => {
        const product = acc.find((p) => p.id === material.productId);

        if (product) {
          if (material.quantity !== null) {
            product.quantity += material.quantity;
          }
        } else {
          acc.push({
            id: material.productId as number,
            quantity: material.quantity || 0,
          });
        }

        return acc;
      },
      [],
    );

    await Promise.all(
      productsWithQuantity.map(async (product) => {
        // create a new history entry
        await db.inventoryProductHistory.create({
          data: {
            companyId,
            productId: product.id,
            date: new Date(date),
            quantity: product.quantity,
            price: materials.find((m) => m.productId === product.id)?.sell,
            vendorId: materials.find((m) => m.productId === product.id)?.vendor
              ?.id!,
            notes,
            type: "Sale",
            invoiceId,
          },
        });

        // update the inventoryProduct quantity
        await db.inventoryProduct.update({
          where: {
            id: product.id,
          },
          data: {
            quantity: {
              decrement: product.quantity,
            },
          },
        });
      }),
    );

    let newPayment;

    switch (type) {
      case "CARD":
        newPayment = await db.payment.create({
          data: {
            companyId,
            invoiceId,
            date: new Date(date),
            notes,
            amount,
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
            companyId,
            invoiceId,
            date: new Date(date),
            notes,
            amount,
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
            companyId,
            invoiceId,
            date: new Date(date),
            notes,
            amount,
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
            companyId,
            invoiceId,
            date: new Date(date),
            notes,
            amount,
            type: "OTHER",
            other: {
              create: {
                paymentMethodId: (additionalData as OtherPaymentData)
                  .paymentMethodId,
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

    // update the invoice
    await db.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        due: {
          decrement: amount,
        },
      },
    });

    return {
      type: "success",
      message: "Payment created",
      data: newPayment,
    };
  } catch (err) {
    console.log({ err });
    return errorHandler(err);
  }
}
