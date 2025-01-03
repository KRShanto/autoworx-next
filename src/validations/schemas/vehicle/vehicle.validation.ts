import { z } from "zod";

// VIN validation regex
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

// License plate validation regex (basic format, adjust as needed)
const LICENSE_PLATE_REGEX = /^[A-Z0-9-\s]{1,10}$/;

// Engine size validation regex
const ENGINE_SIZE_REGEX = /^(\d{1,2}\.\d{1}L|\d{2,4}cc)$/i;

export const createVehicleValidationSchema = z.object({
  year: z
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .nonnegative()
    .refine((year) => year >= 1886 && year <= new Date().getFullYear(), {
      message: "Year must be a valid year",
    }),
  make: z
    .string({
      required_error: "Make is required",
      invalid_type_error: "Make must be a string",
    })
    .nonempty("Make must be required")
    .refine(
      (make) =>
        Number(make) >= 1886 && Number(make) <= new Date().getFullYear(),
      {
        message: "Make must be a valid year",
      },
    ),
  model: z
    .string({
      required_error: "Model is required",
      invalid_type_error: "Model must be a string",
    })
    .trim()
    .min(1, "Model is required")
    .max(50, "Model cannot exceed 50 characters")
    .nonempty("Model must be required"),
  submodel: z.string().optional(),
  type: z.string().optional(),
  colorId: z.number().nonnegative().optional(),
  transmission: z.string().optional(),
  engineSize: z
    .string()
    .trim()
    // .regex(ENGINE_SIZE_REGEX, "Engine size must be in format '2.0L' or '2000cc'")
    .optional()
    .nullish(),

  license: z
    .string()
    .trim()
    .toUpperCase()
    // .regex(LICENSE_PLATE_REGEX, "Invalid license plate format")
    .optional()
    .nullish(),

  vin: z
    .string()
    .trim()
    .toUpperCase()
    // .regex(VIN_REGEX, "Invalid VIN format (must be 17 characters)")
    .optional()
    .nullish(),
  notes: z.string().optional(),
  clientId: z
    .number()
    .int("Color ID must be an integer")
    .nonnegative()
    .optional(),
});

// update vehicle validation schema
export const updateVehicleValidationSchema = z.object({
  vehicleId: z
    .number({ required_error: "Vehicle Id must be required" })
    .int("Client ID must be an integer")
    .nonnegative(),
  year: z
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .nonnegative()
    .refine((year) => year >= 1886 && year <= new Date().getFullYear(), {
      message: "Year must be a valid year",
    }),
  make: z
    .string({
      required_error: "Make is required",
      invalid_type_error: "Make must be a string",
    })
    .nonempty("Make must be required")
    .refine(
      (make) =>
        Number(make) >= 1886 && Number(make) <= new Date().getFullYear(),
      {
        message: "Make must be a valid year",
      },
    ),
  model: z
    .string({
      required_error: "Model is required",
      invalid_type_error: "Model must be a string",
    })
    .trim()
    .min(1, "Model is required")
    .max(50, "Model cannot exceed 50 characters")
    .nonempty("Model must be required"),
  submodel: z.string().optional(),
  type: z.string().optional(),
  colorId: z.number().nonnegative().optional(),
  transmission: z.string().optional(),
  engineSize: z
    .string()
    .trim()
    // .regex(ENGINE_SIZE_REGEX, "Engine size must be in format '2.0L' or '2000cc'")
    .optional()
    .nullish(),

  license: z
    .string()
    .trim()
    .toUpperCase()
    // .regex(LICENSE_PLATE_REGEX, "Invalid license plate format")
    .optional()
    .nullish(),

  vin: z
    .string()
    .trim()
    .toUpperCase()
    // .regex(VIN_REGEX, "Invalid VIN format (must be 17 characters)")
    .optional()
    .nullish(),
  notes: z.string().optional(),
  clientId: z
    .number()
    .int("Color ID must be an integer")
    .nonnegative()
    .optional(),
});
