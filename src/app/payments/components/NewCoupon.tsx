"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import CouponDateComponent from "./CouponDatePicker";

import { useState } from "react";
import { CouponCode, DiscountInput } from "./CodeDiscount";
import { newCoupon } from "@/actions/coupon/new";
import { useRouter } from "next/navigation";
import { Coupon } from "@prisma/client";

export default function NewCoupon({
  setCoupons,
}: {
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[] | null>>;
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(data: FormData) {
    const couponName = data.get("couponName");
    const couponCode = data.get("couponCode");
    const couponType = data.get("couponType");
    const discountType = data.get("discountType");
    const discountValue = data.get("discountValue");
    const startDate = data.get("startDate");
    const endDate = data.get("endDate");

    console.log({
      couponName,
      couponCode,
      discountType,
      discountValue,
      startDate,
      endDate,
      couponType,
    });

    const res = await newCoupon({
      couponName: couponName as string,
      couponCode: couponCode as string,
      discountType: discountType as string,
      discountValue: Number(discountValue),
      startDate: startDate as string,
      endDate: endDate as string,
      couponType: couponType as string,
    });

    if (res.type === "success") {
      setOpen(false);
      setCoupons((prev) => [...(prev || []), res.data]);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
            New +
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
          form
        >
          <DialogHeader>
            <DialogTitle>New Coupon</DialogTitle>
          </DialogHeader>

          <FormError />

          <div className="grid gap-5 overflow-y-auto p-4">
            <SlimInput name="couponName" label="Coupon Name" />
            <CouponCode />
            <SlimInput name="couponType" style={{ width: "300px" }} />

            <div className="flex items-center gap-4">
              <CouponDateComponent customTitle="Start Date" name="startDate" />
              <CouponDateComponent customTitle="End Date" name="endDate" />
            </div>

            <div>
              <DiscountInput />
            </div>
          </div>

          <DialogFooter>
            <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
              Cancel
            </DialogClose>
            <Submit
              className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
              formAction={handleSubmit}
            >
              Create
            </Submit>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
