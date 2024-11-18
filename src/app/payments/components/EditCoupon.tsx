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
import { updateCoupon } from "@/actions/coupon/new";
import { Coupon } from "@prisma/client";

export default function EditCoupon({
  coupon,
  onUpdate,
  onClose,
}: {
  coupon: Coupon;
  onUpdate: (updatedCoupon: Coupon) => void;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(true);

  async function handleSubmit(data: FormData) {
    const couponName = data.get("couponName");
    const couponCode = data.get("couponCode");
    const couponType = data.get("couponType");
    const discountType = data.get("discountType");
    const discountValue = data.get("discountValue");
    const startDate = data.get("startDate");
    const endDate = data.get("endDate");

    const res = await updateCoupon({
      id: coupon.id.toString(),
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
      onUpdate(res.data);
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
        </DialogHeader>

        <FormError />

        <div className="grid gap-5 overflow-y-auto p-4">
          <SlimInput
            name="couponName"
            label="Coupon Name"
            defaultValue={coupon.name}
          />
          <CouponCode defaultValue={coupon.code} />
          <SlimInput
            name="couponType"
            label="Coupon Type"
            style={{ width: "300px" }}
            defaultValue={coupon.type}
          />

          <div className="flex items-center gap-4">
            <CouponDateComponent
              customTitle="Start Date"
              name="startDate"
              defaultValue={coupon.startDate}
            />
            <CouponDateComponent customTitle="End Date" name="endDate"
            defaultValue={coupon.endDate}
            />
          </div>

          <div>
            <DiscountInput
              defaultDiscountType={coupon.discountType}
              defaultDiscountValue={coupon.discount.toString()}
            />
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
            Update
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
