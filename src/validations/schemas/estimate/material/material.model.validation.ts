import { z } from "zod";

export const materialModelSchemaValidation = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1, "name must be required"),
    vendorId: z.number().int().positive().nullable(),
    categoryId: z.number().int().positive().nullable(),
    notes: z.string().nullable(),
    quantity: z.number().int().nullable(),
    cost: z.number().nullable().default(0), // For Decimal
    sell: z.number().nullable().default(0), // For Decimal
    discount: z.number().nullable().default(0), // For Decimal
    companyId: z.number().int().positive(),
    invoiceId: z.string().nullable(),
    invoiceItemId: z.number().int().positive().nullable(),
    productId: z.number().int().positive().nullable(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
  })
  .refine(
    (data) => {
      // Ensure updatedAt is not before createdAt
      return data.updatedAt >= data.createdAt;
    },
    {
      message: "updatedAt cannot be before createdAt",
      path: ["updatedAt"],
    },
  )
  .refine(
    (data) => {
      // If sell price exists, it should be greater than or equal to cost (if cost exists)
      if (data.sell !== null && data.cost !== null) {
        return data.sell >= data.cost;
      }
      return true;
    },
    {
      message: "Sell price must be greater than or equal to cost",
      path: ["sell"],
    },
  )
  .refine(
    (data) => {
      // If discount exists, it should not exceed the sell price
      if (data.discount !== null && data.sell !== null) {
        return data.discount <= data.sell;
      }
      return true;
    },
    {
      message: "Discount cannot exceed sell price",
      path: ["discount"],
    },
  )
  .refine(
    (data) => {
      // Quantity should be positive if provided
      if (data.quantity !== null) {
        return data.quantity >= 0;
      }
      return true;
    },
    {
      message: "Quantity must be zero or positive",
      path: ["quantity"],
    },
  );