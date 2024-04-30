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
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useState } from "react";
import { addVehicle } from "./addVehicle";
import FormError from "@/components/FormError";
import { useFormErrorStore } from "@/stores/form-error";

export default function NewVehicle({ setVehicles }: { setVehicles: any }) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();
  async function handleSubmit(data: FormData) {
    const make = data.get("make") as string;
    const model = data.get("model") as string;
    const year = +(data.get("year") ?? 0) as number;
    const submodel = data.get("submodel") as string;
    const type = data.get("type") as string;

    const res = await addVehicle({
      make,
      model,
      year,
      submodel,
      type,
    }) as any;

    if (res.message) {
      showError({
        field: res.field || "make",
        message: res.message,
      });
    } else {
      setVehicles((prev: any) => [...prev, res]);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + New Vehicle
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Create Vehicle</DialogTitle>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-2 overflow-y-auto">
          <FormError />
          <SlimInput name="year" type="number" />
          <SlimInput name="make" />
          <SlimInput name="model" />
          <SlimInput name="submodel" label="Sub Model" />
          <SlimInput name="type" rootClassName="col-span-full" />
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
