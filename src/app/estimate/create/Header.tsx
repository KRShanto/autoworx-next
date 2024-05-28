"use client";

import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectStatus } from "@/components/Lists/SelectStatus";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { customAlphabet } from "nanoid";
import { useEffect } from "react";
import { CreateEstimateActionsButtons } from "./CreateEstimateActionButtons";

export default function Header() {
  const { invoiceId, title, setTitle, setInvoiceId } = useEstimateCreateStore();

  useEffect(() => setInvoiceId(customAlphabet("1234567890", 10)()), []);

  return (
    <div className="app-shadow col-start-1 flex flex-wrap items-center gap-3 rounded-md p-3">
      <div className="mr-auto flex gap-1">
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
        <SelectClient />
        <SelectVehicle />
        <SelectStatus />
      </div>
    </div>
  );
}
