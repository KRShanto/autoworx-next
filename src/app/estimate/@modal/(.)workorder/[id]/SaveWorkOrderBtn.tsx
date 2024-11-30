"use client";

import { updateDueDate } from "@/actions/estimate/invoice/updateDueDate";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type TProps = {
  invoiceId: string;
  dueDate: string | null;
};
export default function SaveWorkOrderBtn({ invoiceId, dueDate }: TProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const handleUpdateInvoice = async () => {
    try {
      await updateDueDate(invoiceId, dueDate || "");
      router.back();
    } catch (err) {
      console.error(err);
      return;
    }
  };
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(handleUpdateInvoice)}
      className="mx-auto rounded bg-[#6571FF] px-8 py-2 text-white"
    >
      Save Work Order
    </button>
  );
}
