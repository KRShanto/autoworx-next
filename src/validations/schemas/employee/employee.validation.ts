import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";

export const createEmployeeValidationSchema = z.object({
  firstName: z.string().trim().min(1, { message: "firstName cannot be empty" }),
  lastName: z.string().nullable(),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Invalid phone number" }),
  password: z.string({ message: "password must be required" }).min(6),
  address: z.string().trim().min(1, { message: "address cannot be empty" }),
  city: z.string().trim().min(1, { message: "city cannot be empty" }),
  state: z.string().trim().min(1, { message: "state cannot be empty" }),
  zip: z.string().trim().min(1, { message: "zip cannot be empty" }),
  companyName: z
    .string()
    .trim()
    .min(1, { message: "companyName cannot be empty" }),
  commission: z
    .custom<Decimal>((val) => val instanceof Decimal && val.greaterThan(0), {
      message: "commission must be number",
    })
    .default(new Decimal(0)),
  employeeType: z.enum(["Admin", "Manager", "Sales", "Technician", "Other"]),
  joinDate: z.date({ message: "Invalid date" }),
  image: z.string().optional(),
});
