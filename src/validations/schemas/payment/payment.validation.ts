import { CardType, PaymentType } from "@prisma/client";
import { z } from "zod";

export const cardPaymentValidation = z.object({
  creditCard: z.string().nonempty("credit card number must be required"),
  cardType: z.enum(["AMEX", "MASTERCARD", "VISA", "OTHER"] as [
    string,
    ...CardType[],
  ]),
});

export const checkPaymentValidation = z.object({
  checkNumber: z.string().nonempty("check number must be required"),
});

export const cashPaymentValidation = z.object({
  receivedCash: z.number({ message: "receive cash must be required" }),
});

export const otherPaymentValidation = z.object({
  paymentMethodId: z.number(),
  amount: z.number().nonnegative("amount must be positive value"),
});

const additionalDataValidation = z.object({
  creditCard: z.string().nonempty("credit card number must be required"),
  cardType: z.enum(["AMEX", "MASTERCARD", "VISA", "OTHER"] as [
    string,
    ...CardType[],
  ]),
  receiveCash: z.number().nonnegative("number must be positive").default(0),
  paymentMethodId: z.number().positive("payment method Id must be positive"),
});

export const createPaymentValidationSchema = z.object({
  invoiceId: z.string().nonempty("invoice must be required"),
  type: z.enum(["CARD", "CASH", "CHECK", "OTHER"] as [
    string,
    ...PaymentType[],
  ]),
  date: z.date({ message: "Date must be required" }),
  notes: z.string().optional(),
  amount: z.number().nonnegative("number must be positive value"),
  additionalData: additionalDataValidation.required(),
});
