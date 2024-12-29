import { requiredEmailValidationSchema } from "@/validations/utils/email.validation";
import { phoneValidationSchema } from "@/validations/utils/phone.validation";
import { z } from "zod";

export const createClientValidationSchema = z.object({
  firstName: z.string().trim().nonempty("First Name is required"),
  lastName: z.string().trim(),
  email: requiredEmailValidationSchema,
  mobile: phoneValidationSchema.optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  companyName: z.string().optional(),
  sourceId: z.number().optional(),
  tagId: z.number().nonnegative().optional(),
  photo: z.string().optional(),
});
