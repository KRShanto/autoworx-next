import { requiredEmailValidationSchema } from "@/validations/utils/email.validation";
import { phoneValidationSchema } from "@/validations/utils/phone.validation";
import { z } from "zod";

// Reusable postal code validation schema
export const PostalCodeSchema = z.string().trim();
// .regex(
//   /^\d{5}(-\d{4})?$/,
//   "Invalid ZIP code format (must be 12345 or 12345-6789)",
// );

// create a client validation schema
export const createClientValidationSchema = z
  .object({
    firstName: z
      .string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
      })
      .trim()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters")
      .regex(
        /^[A-Za-z\s-']+$/,
        "First name can only contain letters, spaces, hyphens, and apostrophes",
      ),

    lastName: z
      .string({
        invalid_type_error: "Last name must be a string",
      })
      .trim()
      .max(50, "Last name cannot exceed 50 characters")
      // .regex(
      //   /^[A-Za-z\s-']+$/,
      //   "Last name can only contain letters, spaces, hyphens, and apostrophes",
      // )
      .optional()
      .nullish(),

    email: requiredEmailValidationSchema,

    mobile: phoneValidationSchema.optional().nullish(),

    address: z
      .string()
      .trim()
      .max(200, "Address cannot exceed 200 characters")
      .optional()
      .nullish(),

    city: z
      .string()
      .trim()
      .max(100, "City name cannot exceed 100 characters")
      // .regex(
      //   /^[A-Za-z\s-']+$/,
      //   "City can only contain letters, spaces, hyphens, and apostrophes",
      // )
      .optional()
      .nullish(),

    state: z
      .string()
      .trim()
      // .length(2, "State must be a 2-letter code")
      // .regex(/^[A-Z]{2}$/, "State must be a valid 2-letter state code")
      .optional()
      .nullish(),

    zip: PostalCodeSchema.optional().nullish(),

    companyName: z
      .string()
      .trim()
      .max(100, "Company name cannot exceed 100 characters")
      .optional()
      .nullish(),

    sourceId: z
      .number()
      .int("Source ID must be an integer")
      .nonnegative("Source ID must be non-negative")
      .optional()
      .nullish(),

    tagId: z
      .number()
      .int("Tag ID must be an integer")
      .nonnegative("Tag ID must be non-negative")
      .optional()
      .nullish(),

    photo: z
      .string()
      .trim()
      .url("Photo must be a valid URL")
      .optional()
      .nullish(),
  })
  .refine(
    (data) => {
      // If any address field is filled, require city and state
      if (data.address && (!data.city || !data.state)) {
        return false;
      }
      return true;
    },
    {
      message: "City and state are required when address is provided",
      path: ["address"],
    },
  );

// update a client validation schema
export const updateClientValidationSchema = z
  .object({
    id: z.number().int("Client ID must be an integer").nonnegative(),
    firstName: z
      .string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
      })
      .trim()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters")
      .regex(
        /^[A-Za-z\s-']+$/,
        "First name can only contain letters, spaces, hyphens, and apostrophes",
      ),

    lastName: z
      .string({
        invalid_type_error: "Last name must be a string",
      })
      .trim()
      .max(50, "Last name cannot exceed 50 characters")
      // .regex(
      //   /^[A-Za-z\s-']+$/,
      //   "Last name can only contain letters, spaces, hyphens, and apostrophes",
      // )
      .optional()
      .nullish(),

    email: requiredEmailValidationSchema,

    mobile: phoneValidationSchema.optional().nullish(),

    address: z
      .string()
      .trim()
      .max(200, "Address cannot exceed 200 characters")
      .optional()
      .nullish(),

    city: z
      .string()
      .trim()
      .max(100, "City name cannot exceed 100 characters")
      // .regex(
      //   /^[A-Za-z\s-']+$/,
      //   "City can only contain letters, spaces, hyphens, and apostrophes",
      // )
      .optional()
      .nullish(),

    state: z
      .string()
      .trim()
      // .length(2, "State must be a 2-letter code")
      // .regex(/^[A-Z]{2}$/, "State must be a valid 2-letter state code")
      .optional()
      .nullish(),

    zip: PostalCodeSchema.optional().nullish(),

    companyName: z
      .string()
      .trim()
      .max(100, "Company name cannot exceed 100 characters")
      .optional()
      .nullish(),

    sourceId: z
      .number()
      .int("Source ID must be an integer")
      .nonnegative("Source ID must be non-negative")
      .optional()
      .nullish(),

    tagId: z
      .number()
      .int("Tag ID must be an integer")
      .nonnegative("Tag ID must be non-negative")
      .optional()
      .nullish(),

    photo: z
      .string()
      .trim()
      .url("Photo must be a valid URL")
      .optional()
      .nullish(),
  })
  .refine(
    (data) => {
      // If any address field is filled, require city and state
      if (data.address && (!data.city || !data.state)) {
        return false;
      }
      return true;
    },
    {
      message: "City and state are required when address is provided",
      path: ["address"],
    },
  );

// Type inference
export type TCreateClientValidation = z.infer<
  typeof createClientValidationSchema
>;
export type TUpdateClientValidation = z.infer<
  typeof updateClientValidationSchema
>;

// Helper function to transform phone numbers to E.164 format
export const formatPhoneToE164 = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
};

// Helper function to format names
export const formatName = (name: string): string => {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
};
