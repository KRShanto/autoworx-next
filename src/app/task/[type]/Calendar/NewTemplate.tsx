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
// import { addTemplate } from "./addTemplate";
import FormError from "@/components/FormError";
import { useFormErrorStore } from "@/stores/form-error";
import type { EmailTemplateType } from "@/types/email-template";
import { useEmailTemplateStore } from "@/stores/email-template";

export default function NewTemplate({ type }: { type:EmailTemplateType, }) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();
  const {setTemplates} = useEmailTemplateStore();
  async function handleSubmit(data: FormData) {
    const subject = data.get("subject") as string;
    const message = data.get("message") as string;

    // const res = (await addTemplate({ subject, message })) as any;

    // if (res.message) {
    //   showError({
    //     field: res.field || "subject",
    //     message: res.message,
    //   });
    // } else {
      // setTemplates((prev) => [...prev, res]);
      setOpen(false);
    // }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + Add New Template
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Custom Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          <FormError />
          <input type="hidden" name="type" value={type} />
          <SlimInput name="subject" />
          <label className="block">
            <div className="mb-1 px-2 font-medium">Message</div>
            <textarea name="message" rows={10} className={slimInputClassName} required />
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
            Save
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
