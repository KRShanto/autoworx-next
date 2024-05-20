"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import React from "react";
import { GoFileCode } from "react-icons/go";
import { create } from "./actions/create";
import { InvoiceType } from "@prisma/client";

export default function ConvertButton({
  text,
  type,
}: {
  text: string;
  type: InvoiceType;
}) {
  const {
    invoiceId,
    title,
    client,
    vehicle,
    status,
    subtotal,
    discount,
    tax,
    deposit,
    depositNotes,
    depositMethod,
    grandTotal,
    due,
    internalNotes,
    terms,
    policy,
    customerNotes,
    customerComments,
    photos,
    tasks,
    items,
  } = useEstimateCreateStore();

  async function handleSubmit() {
    console.log(photos);
    return;

    const res = await create({
      title,
      invoiceId,
      type,
      clientId: client?.id,
      vehicleId: vehicle?.id,
      statusId: status?.id,
      subtotal,
      discount,
      tax,
      deposit,
      depositNotes,
      depositMethod,
      grandTotal,
      due,
      internalNotes,
      terms,
      policy,
      customerNotes,
      customerComments,
      photos,
      tasks,
      items,
    });
  }

  return (
    <div className="px-3">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 text-nowrap rounded border border-solid border-slate-600 p-2 text-center text-sm"
        onClick={handleSubmit}
      >
        <GoFileCode />
        {text}
      </button>
    </div>
  );
}
