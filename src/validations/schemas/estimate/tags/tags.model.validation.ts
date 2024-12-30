import { z } from "zod";

// Hex color validation regex (must start with # and have 6 characters after)
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const tagModelValidationSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    textColor: z.string().regex(hexColorRegex, {
      message: "Text color must be a valid hex color code (e.g., #000000)",
    }),
    bgColor: z.string().regex(hexColorRegex, {
      message:
        "Background color must be a valid hex color code (e.g., #FFFFFF)",
    }),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    companyId: z.number().int().positive(),
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
      // Ensure text color and background color are not the same
      return data.textColor.toLowerCase() !== data.bgColor.toLowerCase();
    },
    {
      message: "Text color and background color must be different",
      path: ["textColor"],
    },
  );

// Type inference
export type Tag = z.infer<typeof tagModelValidationSchema>;
