"use client";

import { Invoice } from "@prisma/client";
import React from "react";
import { SiConvertio } from "react-icons/si";
import { convertInvoice } from "../../../../actions/estimate/invoice/convert";
import { useRouter } from "next/navigation";

export default function ConvertTo({ invoice }: { invoice: Invoice }) {
  const router = useRouter();

  async function convert() {
    const res = await convertInvoice(invoice.id);
    router.push("/estimate");
  }

  return (
    <button
      className="flex w-full items-center justify-center gap-2 text-nowrap rounded border border-solid border-slate-600 p-2 text-center text-sm"
      onClick={convert}
      type="button"
    >
      <SiConvertio />
      Convert to {invoice.type === "Estimate" ? "Invoice" : "Estimate"}
    </button>
  );
}
