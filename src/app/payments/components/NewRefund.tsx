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
import { SlimTextarea } from "@/components/SlimTextarea";
import Submit from "@/components/Submit";
import { useState } from "react";
import { CiCreditCard2 } from "react-icons/ci";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";

export default function NewRefund() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(data: FormData) {}

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded-md bg-[#6571FF] px-4 py-1 text-white">
            Refund
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
          form
        >
          <DialogHeader>
            <DialogTitle>Refund</DialogTitle>
          </DialogHeader>

          <FormError />

          <div className="grid gap-5 overflow-y-auto p-4">
            <SlimInput name="amount" label="Amount" className="w-[200px]" />

            <div>
              <p className="mb-1 px-2 font-medium">Method</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-x-2 rounded-md border border-[#6571ff] px-4 py-1 text-[#6571ff]">
                  <CiCreditCard2 />

                  <span>Card</span>
                </button>
                <button className="flex items-center gap-x-2 rounded-md border border-[#6571ff] px-4 py-1 text-[#6571ff]">
                  <FaMoneyCheckDollar />

                  <span>Check</span>
                </button>
                <button className="flex items-center gap-x-2 rounded-md border border-[#6571ff] px-4 py-1 text-[#6571ff]">
                  <GiMoneyStack />

                  <span>Cash</span>
                </button>
              </div>
            </div>

            <div>
              <SlimTextarea name="refundReason" label="Reason For Refund" />
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
              Record
            </Submit>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
