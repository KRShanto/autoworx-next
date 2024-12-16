"use server";

import { getCompanyId } from "@/lib/companyId";
import cron from "node-cron";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface NewCouponData {
  couponName: string;
  couponCode: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  couponType: string;
}

// Run a cron job every day at midnight to expire coupons that are past their end date
cron.schedule("0 0 * * *", async () => {
  console.log("Expiring coupons");

  await db.coupon.updateMany({
    where: {
      endDate: {
        lt: new Date(), // Find all coupons where the end date is in the past
      },
      status: "Active", // Only target coupons that are still active
    },
    data: {
      status: "Expired", // Set the status to expired
    },
  });
});

export async function newCoupon(data: NewCouponData) {
  const companyId = await getCompanyId();

  const newCoupon = await db.coupon.create({
    data: {
      companyId,
      name: data.couponName,
      code: data.couponCode,
      discountType: data.discountType === "$" ? "Fixed" : "Percentage",
      discount: data.discountValue,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      type: data.couponType,
      redemptions: 0,
      status: "Active",
    },
  });

  revalidatePath("/payments");

  return {
    type: "success",
    data: newCoupon,
  };
}
//update
interface UpdateCouponData {
  id: string;
  couponName: string;
  couponCode: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  couponType: string;
}

export async function updateCoupon(data: UpdateCouponData) {
  const companyId = await getCompanyId();

  const existingCoupon = await db.coupon.findUnique({
    where: { id: +data.id },
  });

  if (!existingCoupon || existingCoupon.companyId !== companyId) {
    throw new Error(
      "Coupon not found or you do not have permission to update it.",
    );
  }

  const updatedCoupon = await db.coupon.update({
    where: {
      id: +data.id,
    },
    data: {
      name: data.couponName,
      code: data.couponCode,
      discountType: data.discountType === "$" ? "Fixed" : "Percentage",
      discount: data.discountValue,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      type: data.couponType,
    },
  });

  revalidatePath("/payments");

  return {
    type: "success",
    data: updatedCoupon,
  };
}

//delete
export const deleteCoupon = async (couponId: number) => {
  const companyId = await getCompanyId();
  const existingCoupon = await db.coupon.findUnique({
    where: { id: +couponId },
  });
  if (!existingCoupon || existingCoupon.companyId !== companyId) {
    throw new Error(
      "Coupon not found or you do not have permission to delete it.",
    );
  }

  await db.coupon.delete({
    where: { id: +couponId },
  });
  revalidatePath("/payments");
  return { type: "success", message: "Coupon deleted successfully" };
};
