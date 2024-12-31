import { z } from "zod";
import { estimateTagsValidationSchema } from "../tags/tags.validation";
export const laborCreateValidationSchema = z.object({
  name: z.string().nonempty("Labor name is required"),
  categoryId: z
    .number({ message: "category must be required" })
    .nonnegative("Category is required"),
  notes: z.string().optional(),
  tags: z.array(estimateTagsValidationSchema).optional(),
  hours: z
    .number()
    .nonnegative("Hours must be positive value")
    .optional()
    .default(0),
  charge: z
    .number()
    .nonnegative("Charge must be positive value")
    .optional()
    .default(0),
  discount: z
    .number()
    .nonnegative("Discount must be positive value")
    .optional()
    .default(0),
  cannedLabor: z.boolean().optional().default(false),
});
