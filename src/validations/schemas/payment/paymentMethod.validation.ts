import { z } from "zod";

export const createNewPaymentMethodValidation = z
  .string()
  .nonempty("payment method name must be required");
