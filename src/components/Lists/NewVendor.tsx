"use client";

import { Vendor } from "@prisma/client";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import Submit from "../Submit";
import { SlimInput } from "../SlimInput";
import { useListsStore } from "@/stores/lists";
import { newVendor } from "@/app/inventory/vendor/actions/newVendor";
import { SlimTextarea } from "../SlimTextarea";

export default function NewVendor({
  bgShadow,
  button,
  afterSubmit,
}: {
  bgShadow?: boolean;
  button: JSX.Element;
  afterSubmit?: (vendor: Vendor) => void;
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(data: FormData) {
    const name = data.get("contactName") as string;
    const company = data.get("companyName") as string;
    const phone = data.get("phone") as string;
    const email = data.get("email") as string;
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const state = data.get("state") as string;
    const zip = data.get("zip") as string;
    const website = data.get("website") as string;
    const notes = data.get("notes") as string;

    const res = await newVendor({
      name,
      company,
      phone,
      email,
      address,
      city,
      state,
      zip,
      website,
      notes,
    });

    if (res.type === "success") {
      useListsStore.setState({
        vendors: [...useListsStore.getState().vendors, res.data],
      });

      afterSubmit && afterSubmit(res.data);
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{button}</DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
        bgShadow={bgShadow}
      >
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 overflow-y-auto sm:grid-cols-2">
          <SlimInput name="contactName" />
          <SlimInput name="companyName" required={false} />
          <SlimInput name="phone" required={false} />
          <SlimInput name="email" required={false} />
          <SlimInput name="address" required={false} />
          <div className="flex gap-3">
            <SlimInput name="city" required={false} />
            <SlimInput name="state" required={false} />
            <SlimInput name="zip" required={false} />
          </div>
          <div className="sm:col-span-2">
            <SlimInput name="website" required={false} />
            <SlimTextarea name="notes" required={false} />
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
            Save Changes
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
