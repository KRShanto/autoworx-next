import { z } from "zod";

export const createVehicleValidationSchema = z.object({
  year: z.number({ message: "year must be required" }).nonnegative(),
  make: z.string().nonempty("Make must be required"),
  model: z.string().nonempty("Model must be required"),
  submodel: z.string().optional(),
  type: z.string().optional(),
  colorId: z.number().nonnegative().optional(),
  transmission: z.string().optional(),
  engineSize: z.string().optional(),
  license: z.string().optional(),
  vin: z.string().optional(),
  notes: z.string().optional(),
  clientId: z.number().nonnegative().optional(),
});

