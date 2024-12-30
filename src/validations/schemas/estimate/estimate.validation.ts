import { InvoiceType } from "@prisma/client";
import { z } from "zod";
import { serviceModelDataValidationSchema } from "./service/service.model.validation";
import { laborModelSchemaValidation } from "./labor/labor.model.validation";
import { materialModelSchemaValidation } from "./material/material.model.validation";
import { tagModelValidationSchema } from "./tags/tags.model.validation";
import { couponModelValidationSchema } from "./coupon/coupon.model.validation";

// Assuming these are type imports that need to be converted to Zod schemas
const InvoiceTypeEnum = z.enum(["Estimate", "Invoice"] as [
  string,
  ...InvoiceType[],
]);

const itemValidationSchema = z.object({
  service: serviceModelDataValidationSchema.nullable(),
  materials: materialModelSchemaValidation.nullable(),
  labor: laborModelSchemaValidation.nullable(),
  tags: z.array(tagModelValidationSchema),
});

export const estimateCreateValidationSchema = z
  .object({
    invoiceId: z.string(),
    type: InvoiceTypeEnum,

    clientId: z.number().optional(),
    vehicleId: z.number().optional(),

    subtotal: z.number().nonnegative(),
    discount: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    deposit: z.number().nonnegative(),
    depositNotes: z.string(),
    depositMethod: z.string(),
    grandTotal: z.number().nonnegative(),
    due: z.number(),

    internalNotes: z.string(),
    terms: z.string(),
    policy: z.string(),
    customerNotes: z.string(),
    customerComments: z.string(),

    photos: z.array(z.string().url()),

    items: z.array(itemValidationSchema),

    tasks: z.array(
      z.object({
        id: z.number().optional(),
        task: z.string(),
      }),
    ),

    coupon: couponModelValidationSchema.nullable().optional(),
    columnId: z.number().optional(),
  })
  .refine(
    (data) => {
      // Validate that grandTotal is correctly calculated
      const calculatedTotal =
        data.subtotal - data.discount + data.tax - data.deposit;
      return Math.abs(data.grandTotal - calculatedTotal) < 0.01; // Allow for small floating point differences
    },
    {
      message: "Grand total must equal subtotal - discount + tax - deposit",
      path: ["grandTotal"],
    },
  )
  .refine(
    (data) => {
      // Validate that due amount is less than or equal to grand total
      return data.due <= data.grandTotal;
    },
    {
      message: "Due amount cannot exceed grand total",
      path: ["due"],
    },
  );

export type TEstimateCreateValidationSchema = z.infer<
  typeof estimateCreateValidationSchema
>;
