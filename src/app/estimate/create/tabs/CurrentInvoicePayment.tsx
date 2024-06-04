"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import React from "react";

export default function CurrentInvoicePayment() {
  const { due, deposit } = useEstimateCreateStore();

  return (
    <div className="flex border border-slate-400">
      <div className="bg-[#F8FAFF] p-5 px-10 font-semibold">
        <h3>Invoice Payment</h3>
        <p className="text-center">${deposit}</p>
      </div>

      <div className="p-5 px-10 font-semibold">
        <h3>Total Outstanding</h3>
        <p className="text-center">${due}</p>
      </div>
    </div>
  );
}
