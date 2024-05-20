"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import React from "react";
import { GoFileCode } from "react-icons/go";
import { create } from "./actions/create";
import { InvoiceType } from "@prisma/client";
import { customAlphabet } from "nanoid";

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
    const photoPaths = [];

    // upload photos
    if (photos.length > 0) {
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Failed to upload photos");
        return;
      }

      const json = await res.json();
      const data = json.data;
      photoPaths.push(...data);
    }

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
      photos: photoPaths,
      tasks,
      items,
    });

    // change the invoiceId
    // NOTE: this is not necessary, but it's good for development so that we do not get unique constraint errors
    useEstimateCreateStore.setState({
      invoiceId: customAlphabet("1234567890", 10)(),
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
