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
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import Submit from "@/components/Submit";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { useState } from "react";
import { newVendor } from "./actions/newVendor";
import { FaPlus } from "react-icons/fa6";
import { HiTrash } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function DeleteEstimateButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-md bg-red-400 px-3 py-1 text-white hover:bg-red-500"
          aria-label="Delete"
        >
          <HiTrash />
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Delete Estimate</DialogTitle>
        </DialogHeader>

        <p>Are you sure you want to delete this estimate?</p>

        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <Submit
            className="rounded-lg border bg-red-500 px-5 py-2 text-white hover:bg-red-600"
            formAction={async () => router.push("/estimate")}
          >
            Delete
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
