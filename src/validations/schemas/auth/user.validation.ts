import { requiredEmailValidationSchema } from "@/validations/utils/email.validation";
import { z } from "zod";

const createUserValidation = z.object({
  firstName: z.string().trim().min(1, { message: "firstName cannot be empty" }),
  lastName: z.string().optional(),
  email: requiredEmailValidationSchema,
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be string",
    })
    .min(6),
  company: z
    .string()
    .trim()
    .min(1, { message: "company name cannot be empty" }),
});

export type TUserSchemaValidation = z.infer<typeof createUserValidation>;
export { createUserValidation };
