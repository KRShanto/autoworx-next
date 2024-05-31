"use client";

import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectStatus } from "@/components/Lists/SelectStatus";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { customAlphabet } from "nanoid";
import { useEffect } from "react";
import { CreateEstimateActionsButtons } from "./CreateEstimateActionButtons";
import { Customer, Status, Vehicle } from "@prisma/client";

export default function Header({
  id,
  vehicle,
  customer,
  status,
}: {
  id?: string;
  vehicle?: Vehicle;
  customer?: Customer;
  status?: Status;
}) {
  const { invoiceId, setInvoiceId } = useEstimateCreateStore();

  useEffect(() => {
    if (!id) setInvoiceId(customAlphabet("1234567890", 10)());
  }, [id]);

  return (
    <div className="app-shadow col-start-1 flex flex-wrap items-center gap-3 rounded-md p-3">
      <div className="mr-auto flex gap-1">
        <p>{invoiceId}</p>
      </div>

      <CreateEstimateActionsButtons />

      <div className="flex basis-full flex-wrap items-center gap-3">
        <SelectClient value={customer} />
        <SelectVehicle value={vehicle} />
        <SelectStatus value={status} />
      </div>
    </div>
  );
}
