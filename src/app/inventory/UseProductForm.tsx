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
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { InventoryProductType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useProduct as productUse } from "../../actions/inventory/useProduct";
import { useFormErrorStore } from "@/stores/form-error";

export default function UseProductForm({
  productId,
  productType,
  invoiceIds,
  cost,
}: {
  productId: number;
  productType: InventoryProductType;
  invoiceIds: string[];
  cost: number;
}) {
  const [open, setOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const { showError, clearError } = useFormErrorStore();

  // TODO: Add validation for quantity
  async function handleSubmit(formData: FormData) {
    const date = formData.get("date") as string;
    const quantity = formData.get("quantity") as string;
    const notes = formData.get("notes") as string;

    const res = await productUse({
      productId,
      date: new Date(date),
      quantity: parseInt(quantity),
      notes,
      invoiceId,
    });

    if (res.type === "success") {
      setOpen(false);
      setInvoiceId(null);
      clearError();
    } else if (res.type === "globalError") {
      showError({
        field: res.field || "all",
        message:
          res.errorSource && res.errorSource.length > 0
            ? res.errorSource[0].message
            : res.message,
      });
    }
  }

  // Whenever `open` changes, set `invoiceId` to null
  useEffect(() => {
    setInvoiceId(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-28 rounded-md bg-[#FF6262] p-1 text-white">
          {productType === "Product" ? "Loss" : "Use"}
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-full w-[96%] max-w-xl md:w-[30rem]" form>
        <DialogHeader>
          <DialogTitle>
            {productType === "Product" ? "Loss" : "Use"} Product
          </DialogTitle>
        </DialogHeader>

        <FormError />

        <div className="grid grid-cols-2 gap-3 overflow-y-auto p-2">
          <SlimInput
            name="date"
            type="date"
            className="col-span-1"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          <SlimInput name="quantity" className="col-span-1" />
          <SlimInput
            name="cost"
            className="col-span-1"
            defaultValue={cost}
            disabled
          />

          {productType === "Product" && (
            <div className="col-span-2">
              <Selector
                label={(invoice: string | null) => invoice || "Select Invoice"}
                items={invoiceIds}
                selectedItem={invoiceId}
                setSelectedItem={setInvoiceId}
                displayList={(invoiceId) => <p>{invoiceId}</p>}
                newButton={<></>}
              />
            </div>
          )}

          <div className="col-span-2">
            <label htmlFor="notes"> Notes</label>
            <textarea
              id="notes"
              name="notes"
              required={false}
              className="h-28 w-full rounded-sm border border-primary-foreground border-slate-400 bg-white px-2 py-0.5 leading-6 outline-none"
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
