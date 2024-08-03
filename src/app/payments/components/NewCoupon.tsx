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

async function handleSubmit(data: FormData) {
  const couponName = data.get("couponName");
  const couponCode = data.get("couponCode");
  const discountType = data.get("discountType");
  const discountValue = data.get("discountValue");
  const startDate = data.get("startDate");
  const endDate = data.get("endDate");
  const limitToProducts = data.get("limitToProducts");
  const limitPerCustomer = data.get("limitPerCustomer");
  const applyToRecurring = data.get("applyToRecurring");
}
export default function NewCoupon() {
  const [open, setOpen] = useState(false);

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
            <SlimInput
              name="couponType"
              label="Coupon Type"
              style={{ width: "300px" }}
            />

            <div className="flex items-center gap-4">
              <CouponDateComponent customTitle="Start Date" />
              <CouponDateComponent customTitle="End Date" />
            </div>

            <div>
              <DiscountInput />
            </div>
            <div>
              <input type="checkbox" name="limitToProducts" />
              <label className="font-medium ml-4">
                Limit this coupon to selected products/offers
              </label>
            </div>
            <div>
              <input type="checkbox" name="limitPerCustomer" />
              <label className="font-medium ml-4">
                Limit to one use per customer
              </label>
            </div>
            <div>
              <input type="checkbox" name="applyToRecurring" />
              <label className="font-medium ml-4">
                Also apply to recurring/future payments, if applicable
              </label>
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
