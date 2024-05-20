"use client";

import { CreateEstimateActionsButtons } from "./CreateEstimateActionButtons";
import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import { SelectStatus } from "@/components/Lists/SelectStatus";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import { Customer, Status, Vehicle } from "@prisma/client";

export default function Header() {
  const {
    invoiceId,
    title,
    client,
    vehicle,
    status,
    setTitle,
    setClient,
    setVehicle,
    setStatus,
    setInvoiceId,
  } = useEstimateCreateStore();

  useEffect(() => setInvoiceId(customAlphabet("1234567890", 10)()), []);

  return (
    <div className="app-shadow col-start-1 flex flex-wrap items-center gap-3 rounded-md p-3">
      <div className="mr-auto flex gap-1">
        {/* TODO: generate randomly */}
        <p>{invoiceId}</p>
        <p>:</p>
        <input
          name="title"
          placeholder="Enter Title..."
          aria-label="title"
          className="bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <CreateEstimateActionsButtons />

      <div className="flex basis-full flex-wrap items-center gap-3">
        {/* @NabilSnigdho fix the typescript error */}
        {/* @ts-ignore */}
        <SelectClient value={client} setValue={setClient} />
        {/* @ts-ignore */}
        <SelectVehicle value={vehicle} setValue={setVehicle} />
        {/* @ts-ignore */}
        <SelectStatus value={status} setValue={setStatus} />
      </div>
    </div>
  );
}
