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
import Submit from "@/components/Submit";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useState } from "react";
import { HiTrash } from "react-icons/hi2";
import { useParams, usePathname, useRouter } from "next/navigation";
import { deleteInvoice } from "../../../actions/estimate/invoice/delete";

export default function DeleteEstimateButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  async function handleDelete() {
    if (pathname.includes("/estimate/edit/")) {
      const { id } = params as { id: string };
      const res = await deleteInvoice(id);
    }

    useEstimateCreateStore.getState().reset();
    router.push("/estimate");
  }

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
            formAction={handleDelete}
          >
            Delete
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
