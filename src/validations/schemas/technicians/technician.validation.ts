import { z } from "zod";

// Define the enums separately for reusability and type safety
export const PriorityEnum = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
} as const;

export const StatusEnum = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETE: "Complete",
  CANCEL: "Cancel",
} as const;

// create a technician validation schema with more detailed validations
export const createTechnicianValidationSchema = z
  .object({
    serviceId: z
      .number({
        required_error: "Service ID is required",
        invalid_type_error: "Service ID must be a number",
      })
      .int("Service ID must be an integer")
      .positive("Service ID must be positive"),
    due: z
      .date({
        required_error: "Due date is required",
        invalid_type_error: "Invalid due date format",
      })
      .nullable()
      .optional(),

    date: z
      .date({
        required_error: "Date is required",
        invalid_type_error: "Invalid date format",
      })
      .nullable()
      .optional(),

    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Amount must be positive")
      .finite("Amount must be finite"),

    note: z
      .string({
        invalid_type_error: "Note must be a string",
      })
      .trim()
      .max(1000, "Note cannot exceed 1000 characters")
      .optional()
      .nullish(),

    userId: z
      .number({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a number",
      })
      .int("User ID must be an integer")
      .positive("User ID must be positive"),

    priority: z.enum(
      [PriorityEnum.HIGH, PriorityEnum.MEDIUM, PriorityEnum.LOW],
      {
        required_error: "Priority is required",
        invalid_type_error: "Invalid priority value",
      },
    ),

    status: z.enum(
      [
        StatusEnum.PENDING,
        StatusEnum.IN_PROGRESS,
        StatusEnum.COMPLETE,
        StatusEnum.CANCEL,
      ],
      {
        required_error: "Status is required",
        invalid_type_error: "Invalid status value",
      },
    ),

    invoiceId: z
      .string({
        required_error: "Invoice is required",
        invalid_type_error: "Invoice ID must be a number",
      })
      .nonempty("Invoice Must be required"),

    invoiceItemId: z
      .number({
        required_error: "Invoice item ID is required",
        invalid_type_error: "Invoice item ID must be a number",
      })
      .int("Invoice item ID must be an integer")
      .positive("Invoice item ID must be positive"),
  })
  .refine(
    (data) => {
      if (data.date && data.due) {
        // Ensure date is not after due date
        return data.date <= data.due;
      }
      return true;
    },
    {
      message: "Date cannot be after due date",
      path: ["date"],
    },
  );

// update a technician validation schema with more detailed validations
export const updateTechnicianValidationSchema = z
  .object({
    due: z
      .date({
        required_error: "Due date is required",
        invalid_type_error: "Invalid due date format",
      })
      .nullable()
      .optional(),

    date: z
      .date({
        required_error: "Date is required",
        invalid_type_error: "Invalid date format",
      })
      .nullable()
      .optional(),

    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Amount must be positive")
      .finite("Amount must be finite"),

    note: z
      .string({
        invalid_type_error: "Note must be a string",
      })
      .trim()
      .max(1000, "Note cannot exceed 1000 characters")
      .optional()
      .nullish(),

    userId: z
      .number({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a number",
      })
      .int("User ID must be an integer")
      .positive("User ID must be positive"),

    priority: z.enum(
      [PriorityEnum.HIGH, PriorityEnum.MEDIUM, PriorityEnum.LOW],
      {
        required_error: "Priority is required",
        invalid_type_error: "Invalid priority value",
      },
    ),

    status: z
      .enum(
        [
          StatusEnum.PENDING,
          StatusEnum.IN_PROGRESS,
          StatusEnum.COMPLETE,
          StatusEnum.CANCEL,
        ],
        {
          required_error: "Status is required",
          invalid_type_error: "Invalid status value",
        },
      )
      .optional(),

    invoiceId: z
      .string({
        required_error: "Invoice ID is required",
        invalid_type_error: "Invoice ID must be a number",
      })
      .nonempty("Invoice Must be required"),
  })
  .refine(
    (data) => {
      if (data?.date && data?.due) {
        // Ensure date is not after due date
        return data.date <= data.due;
      }
      return true;
    },
    {
      message: "Date cannot be after due date",
      path: ["date"],
    },
  );

// Create a type from the schema
export type TCreateTechnicianSchema = z.infer<
  typeof createTechnicianValidationSchema
>;
export type TUpdateTechnicianSchema = z.infer<
  typeof updateTechnicianValidationSchema
>;
