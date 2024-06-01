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
import Input from "@/components/Input";
import Submit from "@/components/Submit";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function DepositCreate({
  deposit,
  method,
  setDeposit,
  setMethod,
  depositNotes,
  setDepositNotes,
}: {
  setDeposit: Function;
  deposit: number;
  method: string;
  setMethod: Function;
  depositNotes: string;
  setDepositNotes: Function;
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(data: FormData) {
    const deposit = Number.parseFloat(data.get("deposit") as string);
    const method = data.get("method") as string;
    const depositNotes = data.get("deposit-notes") as string;

    setDeposit(deposit);
    setMethod(method);
    setDepositNotes(depositNotes);

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="absolute right-1 rounded-md border-2 border-white px-2 py-1 text-white "
        >
          <FaPlus />
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Add Deposit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 overflow-y-auto">
          <div>
            <label htmlFor="deposit" className="block text-lg font-medium">
              Amount
            </label>
            <Input
              type="number"
              name="deposit"
              className="rounded-md border-2 border-slate-400 p-1 outline-none"
              required
              defaultValue={deposit}
            />
          </div>
          <div>
            <label htmlFor="method" className="block text-lg font-medium">
              Method
            </label>
            <Input
              type="text"
              name="method"
              className="rounded-md border-2 border-slate-400 p-1 outline-none"
              defaultValue={method}
            />
          </div>

          <div>
            <label htmlFor="deposit-notes">Notes</label>
            <textarea
              name="deposit-notes"
              className="h-32 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
              defaultValue={depositNotes}
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
