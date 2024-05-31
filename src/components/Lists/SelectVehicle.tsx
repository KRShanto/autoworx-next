"use client";

import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Vehicle } from "@prisma/client";
import { useEffect, useState } from "react";
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
  const { newAddedVehicle } = useListsStore();
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (newAddedVehicle) {
      setVehicle(newAddedVehicle);
      setOpenDropdown(false);
    }
  }, [newAddedVehicle]);

  return (
    <>
      <input type="hidden" name={name} value={vehicle?.id ?? ""} />
      <Selector
        newButton={<NewVehicle />}
        label={vehicle ? vehicle.model || `Vehicle ${vehicle.id}` : "Vehicle"}
        openState={[openDropdown, setOpenDropdown]}
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
                <p className="text-sm font-bold">{vehicle.model}</p>
              </div>
            </button>
          ))}
        </div>
      </Selector>
    </>
  );
}
