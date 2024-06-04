"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import Submit from "@/components/Submit";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { useState } from "react";
import { newVendor } from "./actions/newVendor";

export default function NewVendor({
  itemId,
  setVendorOpenState,
  setVendor,
}: {
  itemId: string;
  setVendorOpenState: any;
  setVendor: any;
}) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();

  async function handleSubmit(data: FormData) {
    const firstName = data.get("first-name") as string;
    const lastName = data.get("last-name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const company = data.get("company") as string;
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const state = data.get("state") as string;
    const zip = data.get("zip") as string;
    const description = data.get("description") as string;

    const res = await newVendor({
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      city,
      state,
      zip,
      description,
    });

    if (res.type === "error") {
      showError({
        field: res.field || "all",
        message: res.message || "An error occurred",
      });
    } else {
      useListsStore.setState(({ vendors }) => ({
        vendors: [...vendors, res.data],
      }));

      useEstimateCreateStore.setState((state) => {
        const items = state.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              vendor: res.data,
            };
          }
          return item;
        });
        return { items };
      });

      setVendor(res.data);
      setOpen(false);
      setVendorOpenState(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + New Vendor
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Add Vendor</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 overflow-y-auto">
          <FormError />
          <div className="flex">
            <div>
              <label htmlFor="first-name" className="text-lg font-medium">
                First Name
              </label>
              <Input
                type="text"
                name="first-name"
                className="rounded-md border-2 border-slate-400 p-1"
                required
              />
            </div>
            <div>
              <label htmlFor="last-name" className="text-lg font-medium">
                Last Name
              </label>
              <Input
                type="text"
                name="last-name"
                className="rounded-md border-2 border-slate-400 p-1"
              />
            </div>
          </div>

          <div className="flex">
            <div>
              <label htmlFor="email" className="text-lg font-medium">
                Email Address
              </label>
              <Input
                type="text"
                name="email"
                className="rounded-md border-2 border-slate-400 p-1"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-lg font-medium">
                Mobile Number
              </label>
              <Input
                type="number"
                name="phone"
                className="rounded-md border-2 border-slate-400 p-1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address">Address</label>
            <Input
              type="text"
              name="address"
              className="w-full rounded-md border-2 border-slate-400 p-1"
            />
          </div>

          <div className="flex justify-between">
            <div>
              <label htmlFor="city">City</label>
              <br />
              <Input
                type="text"
                name="city"
                className="w-32 rounded-md border-2 border-slate-400 p-1"
              />
            </div>

            <div>
              <label htmlFor="state">State</label>
              <br />
              <Input
                type="text"
                name="state"
                className="w-32 rounded-md border-2 border-slate-400 p-1"
              />
            </div>

            <div>
              <label htmlFor="zip">Zip</label>
              <br />
              <Input
                type="text"
                name="zip"
                className="w-32 rounded-md border-2 border-slate-400 p-1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company">Company Name</label>
            <Input
              type="text"
              name="company"
              className="w-full rounded-md border-2 border-slate-400 p-1"
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              className="h-32 w-full rounded-md border-2 border-slate-400 p-2"
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
            Add
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
