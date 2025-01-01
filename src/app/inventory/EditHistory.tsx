"use client";

import { editHistory } from "@/actions/inventory/editHistory";
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
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { UNITS } from "@/validations/schemas/inventory/inventoryProduct.validation";
import { Vendor } from "@prisma/client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

export default function EditHistory({
  productId,
  historyId,
  date,
  vendor: previousVendor,
  quantity,
  price,
  unit,
  lot,
  notes,
}: {
  productId: number;
  historyId: number;
  date: Date;
  vendor: Vendor | null;
  quantity: number;
  price: number;
  unit: string;
  lot: string;
  notes: string;
}) {
  const { vendors } = useListsStore();
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(previousVendor);
  const [vendorOpen, setVendorOpen] = useState(false);

  const { showError, clearError } = useFormErrorStore();

  async function handleSubmit(formData: FormData) {
    const date = formData.get("date") as string;
    const quantity = formData.get("quantity") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as string;
    const lot = formData.get("lot") as string;
    const notes = formData.get("notes") as string;

    const res = await editHistory({
      historyId,
      productId,
      date: new Date(date),
      quantity: parseInt(quantity),
      notes,
      vendorId: vendor?.id,
      price: parseFloat(price),
      unit: unit as (typeof UNITS)[number],
      lot,
    });

    if (res.type === "success") {
      setOpen(false);
      clearError();
    } else if (res.type === "globalError") {
      showError({
        field: res.field,
        message:
          res.errorSource && res.errorSource.length > 0
            ? res.errorSource[0].message
            : res.message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-[#6571FF]">
          <FaEdit />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-full w-[30rem] max-w-xl" form>
        <DialogHeader>
          <DialogTitle>Edit History</DialogTitle>
        </DialogHeader>

        <FormError />

        <div className="flex flex-col gap-3 p-2">
          <SlimInput
            name="date"
            type="date"
            className="col-span-1"
            defaultValue={date.toISOString().split("T")[0]}
          />
          {/* TODO: make reusable component */}
          <div>
            <label>Vendor</label>

            <Selector
              label={(vendor: Vendor | null) =>
                vendor
                  ? vendor?.companyName || vendor.name || `Vendor ${vendor.id}`
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
            <SlimInput
              name="quantity"
              required={false}
              defaultValue={quantity}
            />

            <div>
              <label htmlFor="price" className="px-2 font-medium">
                Price
              </label>
              <div className="#mt-1 flex gap-1 rounded-sm border border-primary-foreground bg-white px-2 py-0.5 leading-6">
                <span className="text-lg">$</span>
                <input
                  type="text"
                  name="price"
                  className="w-full rounded-sm border border-slate-400 px-2 py-0.5 outline-none"
                  id="price"
                  defaultValue={price}
                />
              </div>
            </div>

            <SlimInput name="unit" required={false} defaultValue={unit} />
            <SlimInput name="lot" required={false} defaultValue={lot} />
          </div>

          <div className="col-span-2">
            <label htmlFor="notes"> Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="h-28 w-full rounded-sm border border-primary-foreground border-slate-400 bg-white px-2 py-0.5 leading-6 outline-none"
              defaultValue={notes}
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
