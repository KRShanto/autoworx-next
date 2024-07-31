"use client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { createWorkOrder } from "../../../../../actions/workorder/createWorkOrder";

export default function CreateWorkOrderBtn({
  id,
  invoiceId,
}: {
  id: string;
  invoiceId: string;
}) {
  const [isPending, startTranstion] = useTransition();
  const router = useRouter();
  const handleWorkOrder = async () => {
    try {
      const response = await createWorkOrder({ invoiceId });
      if (response.type === "success") {
        router.push(
          `/estimate/create-work-order/${id}?workOrderId=${response.data.id}`,
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <button
      disabled={isPending}
      onClick={() => startTranstion(handleWorkOrder)}
      className="rounded-md bg-[#6571FF] py-2 text-center text-white disabled:bg-gray-400"
    >
      Create Work Order
    </button>
  );
}
