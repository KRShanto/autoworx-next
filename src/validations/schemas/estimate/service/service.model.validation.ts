import { z } from "zod";
export const serviceModelDataValidationSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    categoryId: z.number().int().positive().nullable(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    fromRequest: z.boolean().nullable(),
    fromRequestedCompanyId: z.number().int().positive().nullable(),
    companyId: z.number().int().positive(),
  })
  .refine(
    (data) => {
      // If fromRequest is true, fromRequestedCompanyId should be non-null
      if (data.fromRequest === true) {
        return data.fromRequestedCompanyId !== null;
      }
      return true;
    },
    {
      message:
        "fromRequestedCompanyId must be provided when fromRequest is true",
      path: ["fromRequestedCompanyId"],
    },
  )
  .refine(
    (data) => {
      // Ensure updatedAt is not before createdAt
      return data.updatedAt >= data.createdAt;
    },
    {
      message: "updatedAt cannot be before createdAt",
      path: ["updatedAt"],
    },
  );
