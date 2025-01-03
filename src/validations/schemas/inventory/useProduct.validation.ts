import { z } from "zod";
import { UNITS } from "./inventoryProduct.validation";

// remove product from inventory validation schema
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

// update sales inventory history validation schema

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

// update purchase inventory history validation schema
export const updatePurchaseInventoryHistorySchema = z.object({
  historyId: z.number().int().positive(),

  productId: z.number().int().positive(),

  date: z.date().optional(),
  // .max(new Date(), "Date cannot be in the future"),

  vendorId: z.number().int().positive().optional(),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .nonnegative("Price must be non-negative")
    .finite("Price must be finite")
    .refine(
      (num) => (num * 100) % 1 === 0,
      "Price cannot have more than 2 decimal places",
    )
    .optional()
    .nullable(),

  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be non-negative"),

  unit: z
    .enum(UNITS, {
      invalid_type_error:
        "Invalid unit type use one of: piece, kg, lb, oz, g, l, ml, box, pack",
    })
    .optional()
    .nullish(),

  lot: z
    .string()
    .trim()
    .max(50, "Lot number cannot exceed 50 characters")
    .optional()
    .nullish(),

  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

export type TLossProductValidation = z.infer<
  typeof lossProductValidationSchema
>;
export type TUpdateSalesInventoryHistorySchema = z.infer<
  typeof updateSalesInventoryHistorySchema
>;

export type TUpdatePurchaseInventoryHistorySchema = z.infer<
  typeof updatePurchaseInventoryHistorySchema
>;
