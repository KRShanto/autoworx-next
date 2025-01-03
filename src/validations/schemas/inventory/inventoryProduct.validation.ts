import { InventoryProductType } from "@prisma/client";
import { z } from "zod";

export const UNITS = [
  "",
  "piece",
  "kg",
  "lb",
  "oz",
  "g",
  "l",
  "ml",
  "box",
  "pack",
] as const;

// create product validation schema for inventory products
export const createProductValidationSchema = z
  .object({
    name: z
      .string({
        required_error: "Product name is required",
        invalid_type_error: "Product name must be a string",
      })
      .trim()
      .min(3, "Product name must be at least 3 characters")
      .max(100, "Product name cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional()
      .nullish(),

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

    categoryId: z
      .number()
      .int("Category ID must be an integer")
      .positive("Category ID must be positive")
      .optional()
      .nullish(),

    vendorId: z
      .number()
      .int("Vendor ID must be an integer")
      .positive("Vendor ID must be positive")
      .optional()
      .nullish(),

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

    type: z.enum([InventoryProductType.Product, InventoryProductType.Supply], {
      required_error: "Product type is required",
      invalid_type_error: "Invalid product type",
    }),

    receipt: z
      .string()
      .trim()
      //   .url("Receipt must be a valid URL")
      .optional()
      .nullish(),

    lowInventoryAlert: z
      .number()
      .int("Low inventory alert must be an integer")
      .nonnegative("Low inventory alert must be non-negative")
      .refine((num) => num <= 10000, "Alert threshold too high")
      .optional()
      .nullish(),
  })
  .refine(
    (data) => {
      if (data.quantity < (data.lowInventoryAlert ?? 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Low inventory alert must be less than current quantity",
      path: ["lowInventoryAlert"],
    },
  );

// update product validation schema for inventory products
export const updateProductValidationSchema = z
  .object({
    id: z
      .number()
      .int("Product ID must be an integer")
      .positive("Product ID must be positive"),
    name: z
      .string({
        required_error: "Product name is required",
        invalid_type_error: "Product name must be a string",
      })
      .trim()
      .min(3, "Product name must be at least 3 characters")
      .max(100, "Product name cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional()
      .nullish(),

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

    categoryId: z
      .number()
      .int("Category ID must be an integer")
      .positive("Category ID must be positive")
      .optional()
      .nullish(),

    vendorId: z
      .number()
      .int("Vendor ID must be an integer")
      .positive("Vendor ID must be positive")
      .optional()
      .nullish(),

    quantity: z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
      })
      .int("Quantity must be an integer")
      .nonnegative("Quantity must be non-negative")
      .optional()
      .nullable(),

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

    type: z.enum([InventoryProductType.Product, InventoryProductType.Supply], {
      required_error: "Product type is required",
      invalid_type_error: "Invalid product type",
    }),

    receipt: z
      .string()
      .trim()
      //   .url("Receipt must be a valid URL")
      .optional()
      .nullish(),

    lowInventoryAlert: z
      .number()
      .int("Low inventory alert must be an integer")
      .nonnegative("Low inventory alert must be non-negative")
      .refine((num) => num <= 10000, "Alert threshold too high")
      .optional()
      .nullish(),
  })
  .refine(
    (data) => {
      if (data.quantity && data.quantity < (data.lowInventoryAlert ?? 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Low inventory alert must be less than current quantity",
      path: ["lowInventoryAlert"],
    },
  );

export type TCreateProductValidation = z.infer<
  typeof createProductValidationSchema
>;

export type TUpdateProductValidation = z.infer<
  typeof updateProductValidationSchema
>;
