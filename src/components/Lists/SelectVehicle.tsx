"use client";

import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Vehicle } from "@prisma/client";
import { useState } from "react";
import NewVehicle from "./NewVehicle";
import { SelectProps } from "./select-props";

export function SelectVehicle({
  name = "vehicleId",
  value = null,
  setValue,
}: SelectProps<Vehicle | null>) {
  const state = useState(value);
  const [vehicle, setVehicle] = setValue ? [value, setValue] : state;
  const vehicleList = useListsStore((x) => x.vehicles);

  return (
    <>
      <input type="hidden" name={name} value={vehicle?.id ?? ""} />
      <Selector
        newButton={<NewVehicle />}
        label={vehicle ? vehicle.model || `Vehicle ${vehicle.id}` : "Vehicle"}
      >
        <div className="">
          {vehicleList.map((vehicle) => (
            <button
              type="button"
              key={vehicle.id}
              className="flex w-full cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-gray-100"
              onClick={() => setVehicle(vehicle)}
            >
              <div>
                <p className="text-sm font-bold">
                  {`${vehicle.model} ${vehicle.id}`}
                </p>
                <p className="text-xs">Owner</p> {/* TODO: Add owner name */}
              </div>
            </button>
          ))}
        </div>
      </Selector>
    </>
  );
}
