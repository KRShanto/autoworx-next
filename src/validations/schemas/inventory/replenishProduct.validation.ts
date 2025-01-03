import { z } from "zod";
import { UNITS } from "./inventoryProduct.validation";
export const replenishProductValidationSchema = z.object({
  productId: z.number().int("Product ID must be an integer").positive(),
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Date must be a valid date",
  }),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be a positive number"),
  vendorId: z.number().int("Vendor ID must be an integer").optional(),
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
    ),
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
  notes: z.string().trim().optional().nullish(),
});

export type TReplenishProductValidation = z.infer<
  typeof replenishProductValidationSchema
>;
