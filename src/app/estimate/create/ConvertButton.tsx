"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import React from "react";
import { InvoiceType } from "@prisma/client";
import Submit from "@/components/Submit";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { useInvoiceCreate } from "@/hooks/useInvoiceCreate";

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
  const router = useRouter();
  const createInvoice = useInvoiceCreate(type);

  async function handleSubmit() {
    const res = await createInvoice();

    // Redirect to the index
    router.push("/estimate");
    // Reset the states
    useEstimateCreateStore.getState().reset();
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
