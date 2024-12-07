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
import { useEffect, useState } from "react";
import Selector from "@/components/Selector";
import { InventoryProductHistory, InventoryProductType } from "@prisma/client";
import { FaEdit } from "react-icons/fa";
import { editUseProduct } from "@/actions/inventory/editUseProduct";

export default function EditProductForm({
  productId,
  productType,
  invoiceIds,
  cost,
  history,
}: {
  productId: number;
  productType: InventoryProductType;
  invoiceIds: string[];
  cost: number;
  history: InventoryProductHistory;
}) {
  const [open, setOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  // TODO: Add validation for quantity
  async function handleSubmit(formData: FormData) {
    const quantity = formData.get("quantity") as string;
    const notes = formData.get("notes") as string;

    const res = await editUseProduct({
      inventoryProductHistoryId: history.id,
      productId,
      quantity: parseInt(quantity),
      notes,
      invoiceId,
    });

    if (res.type === "success") {
      setOpen(false);
      setInvoiceId(null);
    }
  }

  // Whenever `open` changes, set `invoiceId` to null
  useEffect(() => {
    setInvoiceId(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-center text-[#6571FF]">
          <FaEdit />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-full w-[30rem] max-w-xl" form>
        <DialogHeader>
          <DialogTitle>Update Use Product</DialogTitle>
        </DialogHeader>

        <FormError />

        <div className="grid grid-cols-2 gap-3 overflow-y-auto p-2">
          <SlimInput
            name="date"
            type="date"
            className="col-span-1"
            disabled
            defaultValue={new Date(history?.date!).toISOString().split("T")[0]}
          />
          <SlimInput
            name="quantity"
            className="col-span-1"
            defaultValue={history.quantity}
          />
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
              className="h-28 w-full rounded-sm border border-slate-400 border-primary-foreground bg-white px-2 py-0.5 leading-6 outline-none"
              defaultValue={history?.notes || ""}
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
