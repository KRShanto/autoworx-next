import { z } from "zod";

// Assuming these are your enum types
const DiscountTypeEnum = z.enum(["Percentage", "Fixed"]); // Adjust values based on your actual enum
const CouponStatusEnum = z.enum(["Active", "Expired"]); // Adjust values based on your actual enum

export const couponModelValidationSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    code: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[A-Za-z0-9-_]+$/, {
        message:
          "Coupon code must only contain letters, numbers, hyphens, and underscores",
      }),
    type: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    discount: z
      .number()
      .positive()
      .refine(
        (val) => Number.isFinite(val),
        "Discount must be a finite number",
      ),
    discountType: DiscountTypeEnum,
    status: CouponStatusEnum,
    redemptions: z.number().int().nonnegative(),
    companyId: z.number().int().positive(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
  })
  .refine(
    (data) => {
      // Ensure endDate is after startDate
      return data.endDate > data.startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      // Ensure updatedAt is not before createdAt
      return data.updatedAt >= data.createdAt;
    },
    {
      message: "updatedAt cannot be before createdAt",
      path: ["updatedAt"],
    },
  )
  .refine(
    (data) => {
      // For percentage discounts, ensure discount is between 0 and 100
      if (data.discountType === "Percentage") {
        return data.discount <= 100;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discount"],
    },
  )
  .refine(
    (data) => {
      // Automatically set status based on dates
      const now = new Date();
      if (data.endDate < now) {
        return data.status === "Expired";
      }
      return true;
    },
    {
      message: "Coupon status should be EXPIRED if end date has passed",
      path: ["status"],
    },
  );

// Type inference
export type Coupon = z.infer<typeof couponModelValidationSchema>;
