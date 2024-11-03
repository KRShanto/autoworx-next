"use client";

import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectStatus } from "@/components/Lists/SelectStatus";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { Client, Column, Status, Vehicle } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";
import { CreateEstimateActionsButtons } from "./CreateEstimateActionButtons";

export default function Header({
  id,
  vehicle,
  client,
  status,
}: {
  id?: string;
  vehicle?: Vehicle;
  client?: Client;
  status?: Column;
}) {
  const { invoiceId, setInvoiceId } = useEstimateCreateStore();
  //dropdown states
  const [clientOpenDropdown, setClientOpenDropdown] = useState(false);
  const [vehicleOpenDropdown, setVehicleOpenDropdown] = useState(false);
  const [statusOpenDropdown, setStatusOpenDropdown] = useState(false);

  useEffect(() => {
    if (!id) setInvoiceId(customAlphabet("1234567890", 10)());
  }, [id]);

  console.log({ vehicle, client });

  useEffect(() => {
    if (clientOpenDropdown && (vehicleOpenDropdown || statusOpenDropdown)) {
      setVehicleOpenDropdown(false);
      setStatusOpenDropdown(false);
    } else if (
      vehicleOpenDropdown &&
      (clientOpenDropdown || statusOpenDropdown)
    ) {
      setClientOpenDropdown(false);
      setStatusOpenDropdown(false);
    } else if (
      statusOpenDropdown &&
      (clientOpenDropdown || vehicleOpenDropdown)
    ) {
      setClientOpenDropdown(false);
      setVehicleOpenDropdown(false);
    }
  }, [statusOpenDropdown, clientOpenDropdown, vehicleOpenDropdown]);
  return (
    <div className="app-shadow col-start-1 flex flex-wrap items-center gap-3 rounded-md p-3">
      <div className="mr-auto flex gap-1">
        <p>{invoiceId}</p>
      </div>

      <CreateEstimateActionsButtons />

      <div className="flex basis-full flex-wrap items-center gap-3">
        <SelectClient
          value={client}
          openDropdown={clientOpenDropdown}
          setOpenDropdown={setClientOpenDropdown}
        />
        <SelectVehicle
          value={vehicle}
          openDropdown={vehicleOpenDropdown}
          setOpenDropdown={setVehicleOpenDropdown}
        />

        <SelectStatus
          value={status}
          open={statusOpenDropdown}
          setOpen={setStatusOpenDropdown}
        />
      </div>
    </div>
  );
}
