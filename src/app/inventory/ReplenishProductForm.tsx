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
import NewVendor from "@/components/Lists/NewVendor";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useListsStore } from "@/stores/lists";
import { Vendor } from "@prisma/client";
import { useState } from "react";
import { replenish } from "../../actions/inventory/replenish";

export default function ReplenishProductForm({
  productId,
}: {
  productId: number;
}) {
  const { vendors } = useListsStore();
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [vendorOpen, setVendorOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const date = formData.get("date") as string;
    const quantity = formData.get("quantity") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as string;
    const lot = formData.get("lot") as string;
    const notes = formData.get("notes") as string;

    const res = await replenish({
      productId,
      date: new Date(date),
      quantity: parseInt(quantity),
      notes,
      vendorId: vendor?.id,
      price: parseFloat(price),
      unit,
      lot,
    });

    if (res.type === "success") {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-28 rounded-md bg-[#69DBD0] p-1 text-white">
          Replenish
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-full w-[30rem] max-w-xl" form>
        <DialogHeader>
          <DialogTitle>Replenish Product</DialogTitle>
        </DialogHeader>

        <FormError />

        <div className="flex flex-col gap-3 p-2">
          <SlimInput
            name="date"
            type="date"
            className="col-span-1"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          {/* TODO: make reusable component */}
          <div>
            <label>Vendor</label>

            <Selector
              label={(vendor: Vendor | null) =>
                vendor
                  ? vendor?.companyName || vendor?.name || `Vendor ${vendor.id}`
                  : "Vendor"
              }
              newButton={
                <NewVendor
                  afterSubmit={(ven) => {
                    setVendor(ven);
                    setVendorOpen(false);
                  }}
                  button={
                    <button type="button" className="text-xs text-[#6571FF]">
                      + New Vendor
                    </button>
                  }
                />
              }
              displayList={(vendor: Vendor) => (
                <p>{vendor?.companyName || vendor.name}</p>
              )}
              items={vendors}
              onSearch={(search: string) =>
                vendors.filter(
                  (vendor) =>
                    vendor?.companyName
                      ?.toLowerCase()
                      ?.includes(search.toLowerCase()) ||
                    vendor.name.toLowerCase().includes(search.toLowerCase()),
                )
              }
              openState={[vendorOpen, setVendorOpen]}
              selectedItem={vendor}
              setSelectedItem={setVendor}
            />
          </div>

          <div className="flex gap-3">
            <SlimInput name="quantity" required={false} />

            <div>
              <label htmlFor="price" className="px-2 font-medium">
                Price
              </label>
              <div className="mt-1 flex gap-1 rounded-sm border border-primary-foreground bg-white px-2 py-0.5 leading-6">
                <span className="text-lg">$</span>
                <input
                  type="text"
                  name="price"
                  className="w-full outline-none"
                  id="price"
                />
              </div>
            </div>

            <SlimInput name="unit" required={false} />
            <SlimInput name="lot" required={false} />
          </div>

          <div className="col-span-2">
            <label htmlFor="notes"> Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="h-28 w-full rounded-sm border border-primary-foreground bg-white px-2 py-0.5 leading-6 outline-none"
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
            Submit
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
