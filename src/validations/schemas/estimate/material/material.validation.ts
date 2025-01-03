import { z } from "zod";
import { estimateTagsValidationSchema } from "../tags/tags.validation";

export const materialCreateValidationSchema = z.object({
  name: z.string().nonempty("Material name is required"),
  categoryId: z
    .number({ message: "Category must be required" })
    .nonnegative("Category is required"),
  vendorId: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  tags: z.array(estimateTagsValidationSchema).optional(),
  cost: z
    .number()
    .nonnegative("Cost must be positive value")
    .optional()
    .default(0),
  quantity: z
    .number()
    .nonnegative("Quantity must be positive value")
    .optional()
    .default(1),
  sell: z
    .number()
    .nonnegative("sell must be positive value")
    .optional()
    .default(0),
  discount: z
    .number()
    .nonnegative("Discount must be positive value")
    .optional()
    .default(0),
  addToInventory: z.boolean().optional().default(false),
});
