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
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useState } from "react";
import { addOrder } from "../../actions/addOrder";
import FormError from "@/components/FormError";
import { useFormErrorStore } from "@/stores/form-error";

export default function NewOrder({ setOrders }: { setOrders: any }) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();
  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;
    const comment = data.get("comment") as string;

    const res = (await addOrder({ name, comment })) as any;

    if (res.message) {
      showError({
        field: res.field || "name",
        message: res.message,
      });
    } else {
      setOrders((prev: any) => [...prev, res]);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + New Order
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Add Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          <FormError />
          <SlimInput name="name" label="Order Name" />
          <label className="block">
            <div className="mb-1 px-2 font-medium">Client Comments</div>
            <textarea name="comment" rows={3} className={slimInputClassName} />
          </label>
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
