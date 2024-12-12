"use server";

import { getCompanyId } from "@/lib/companyId";
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
}: PaymentData): Promise<ServerAction> {
  const companyId = await getCompanyId();

  // Get all the product materials and include the product to get its name
  const materials = await db.material.findMany({
    where: {
      invoiceId,
      productId: { not: null },
    },
    include: {
      vendor: true,
      product: true, // Include the product to get its name
    },
  });

  // Merge all the same products and sum the quantity
  const productsWithQuantity = materials.reduce(
    (acc: { id: number; quantity: number; name: string }[], material) => {
      const product = acc.find((p) => p.id === material.productId);

      if (product) {
        if (material.quantity !== null) {
          product.quantity += material.quantity;
        }
      } else {
        acc.push({
          id: material.productId as number,
          quantity: material.quantity || 0,
          name: material.product?.name || "Product", // Store product name
        });
      }

      return acc;
    },
    [],
  );

  // Fetch inventory products
  const inventoryProducts = await db.inventoryProduct.findMany({
    where: {
      id: { in: productsWithQuantity.map((p) => p.id) },
    },
  });

  // Check inventory quantities
  for (const product of productsWithQuantity) {
    const inventoryProduct = inventoryProducts.find(
      (ip) => ip.id === product.id,
    );
    if (
      inventoryProduct &&
      (inventoryProduct.quantity || 0) < product.quantity
    ) {
      return {
        type: "error",
        message: `Insufficient quantity of ${product.name} in inventory.`,
      };
    }
  }

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
}
