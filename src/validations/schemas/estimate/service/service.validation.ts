import { z } from "zod";

export const serviceCreateValidationSchema = z.object({
  name: z.string().nonempty("Service name is required"),
  categoryId: z
    .number({ message: "category must be required" })
    .nonnegative("Category is required"),
  description: z.string(),
});






export type TServiceCreateValidationSchema = z.infer<
  typeof serviceCreateValidationSchema
>;
