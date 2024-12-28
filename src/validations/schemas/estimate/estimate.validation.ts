import { z } from "zod";

export const estimateCreateValidationSchema = z.object({});

export type TEstimateCreateValidationSchema = z.infer<
  typeof estimateCreateValidationSchema
>;
