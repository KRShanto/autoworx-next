import { z } from "zod";

export const laborModelSchemaValidation = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    categoryId: z.number().int().positive().nullable(),
    notes: z.string().nullable(),
    hours: z
      .number()
      .nullable()
      .refine(
        (val) => val === null || (val >= 0 && Number.isFinite(val)),
        "Hours must be a positive number",
      ),
    charge: z
      .number()
      .nullable()
      .refine(
        (val) => val === null || (val >= 0 && Number.isFinite(val)),
        "Charge must be a positive number",
      ),
    discount: z
      .number()
      .nullable()
      .refine(
        (val) => val === null || (val >= 0 && Number.isFinite(val)),
        "Discount must be a positive number",
      ),
    companyId: z.number().int().positive(),
    cannedLabor: z.boolean().nullable().default(false),
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
      // If discount exists, it should not exceed the charge
      if (data.discount !== null && data.charge !== null) {
        return data.discount <= data.charge;
      }
      return true;
    },
    {
      message: "Discount cannot exceed charge amount",
      path: ["discount"],
    },
  )
  .refine(
    (data) => {
      // Hours should be limited to 3 decimal places to match DB schema
      if (data.hours !== null) {
        const decimalPlaces = (data.hours.toString().split(".")[1] || "")
          .length;
        return decimalPlaces <= 3;
      }
      return true;
    },
    {
      message: "Hours cannot have more than 3 decimal places",
      path: ["hours"],
    },
  );
