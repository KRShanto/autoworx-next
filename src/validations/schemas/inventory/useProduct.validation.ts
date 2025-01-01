import { z } from "zod";

export const lossProductValidationSchema = z.object({
  productId: z
    .number({
      required_error: "Product ID is required",
      invalid_type_error: "Product ID must be a number",
    })
    .int("Product ID must be an integer")
    .positive("Product ID must be positive"),

  invoiceId: z.string().nullish(),

  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  // .refine((date) => date <= new Date(), "Date cannot be in the future"),

  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be a positive number")
    .refine((q) => q !== 0, "Quantity cannot be zero"),

  notes: z
    .string({
      required_error: "Notes are required",
      invalid_type_error: "Notes must be a string",
    })
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .nullable(),
});

export const updateSalesInventoryHistorySchema = z.object({
  productId: z
    .number()
    .int("Product ID must be an integer")
    .positive("Product ID must be positive"),

  invoiceId: z.string().nullish(),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be positive")
    .refine((q) => q !== 0, "Quantity cannot be zero"),

  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters"),

  inventoryProductHistoryId: z
    .number()
    .int("History ID must be an integer")
    .positive("History ID must be positive"),
});

export type TLossProductValidation = z.infer<
  typeof lossProductValidationSchema
>;
export type TUpdateInventoryHistorySchema = z.infer<
  typeof updateSalesInventoryHistorySchema
>;
