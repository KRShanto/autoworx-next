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

export default function NewClientSource({
  clientSources,
  setClientSources,
}: {
  clientSources: any;
  setClientSources: any;
}) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();
  const [source, setSource] = useState("");
  const handleSubmit = () => {
    setClientSources((prev) => [...prev, { id: Math.random() * 100, source }]);
    setSource("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + Add Client Source
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Add Source</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          <FormError />
          <SlimInput
            name="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        </div>

        <DialogFooter>
          <DialogClose
            onClick={() => {
              setSource("");
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
