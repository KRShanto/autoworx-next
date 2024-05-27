"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import React from "react";
import { GoFileCode } from "react-icons/go";
import { create } from "./actions/create";
import { InvoiceType } from "@prisma/client";
import { customAlphabet } from "nanoid";
import Submit from "@/components/Submit";
import { createTask } from "@/app/task/[type]/actions/createTask";
import { cn } from "@/lib/cn";

export default function ConvertButton({
  text,
  icon,
  type,
  className,
}: {
  text: string;
  icon: React.ReactNode;
  type: InvoiceType;
  className?: string;
}) {
  const {
    invoiceId,
    title,
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

  async function handleSubmit(formData: FormData) {
    const photoPaths = [];
    const clientId = formData.get("customerId");
    const vehicleId = formData.get("vehicleId");
    const statusId = formData.get("statusId");

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
      clientId: clientId ? +clientId : undefined,
      vehicleId: vehicleId ? +vehicleId : undefined,
      statusId: statusId ? +statusId : undefined,
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
      items,
    });

    // Create tasks
    tasks.forEach(async (task) => {
      if (!task) return;

      const taskSplit = task.split(":");

      await createTask({
        title: taskSplit[0],
        description: taskSplit.length > 1 ? taskSplit[1] : "",
        priority: "Medium",
        assignedUsers: [],
        invoiceId: res.data.id,
      });
    });

    // change the invoiceId
    // NOTE: this is not necessary, but it's good for development so that we do not get unique constraint errors
    useEstimateCreateStore.setState({
      invoiceId: customAlphabet("1234567890", 10)(),
    });
  }

  return (
    <div className="px-3">
      <Submit
        className={cn(
          "flex w-full items-center justify-center gap-2 text-nowrap rounded border border-solid border-slate-600 p-2 text-center text-sm",
          className,
        )}
        formAction={handleSubmit}
      >
        {icon}
        {text}
      </Submit>
    </div>
  );
}
