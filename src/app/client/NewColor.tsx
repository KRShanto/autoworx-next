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
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useFormErrorStore } from "@/stores/form-error";
import { useEffect, useState } from "react";
import { Color } from "./AddNewVehicle";

export default function NewColor({
  colors,
  setColors,
}: {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
}) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();
  const [color, setColor] = useState<string>("");
  const handleSubmit = async () => {
    setColors((prev) => [...prev, { id: Math.random() * 100, color: color }]);
    setColor("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + Add Color
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Add Color</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          <FormError />
          <SlimInput
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <DialogFooter>
          <DialogClose
            onClick={() => {
              setColor("");
            }}
            className="rounded-lg border-2 border-slate-400 p-2"
          >
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
