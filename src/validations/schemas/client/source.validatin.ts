import { z } from "zod";

export const sourceValidationSchema = z.object({
  name: z.string().trim().nonempty("Source Name is required"),
});
