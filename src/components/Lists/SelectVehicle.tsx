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
  openDropdown,
  setOpenDropdown,
}: SelectProps<Vehicle | null>) {
  const state = useState(value);
  const [vehicle, setVehicle] = setValue ? [value, setValue] : state;
  const vehicleList = useListsStore((x) => x.vehicles);
  const { newAddedVehicle } = useListsStore();
  // const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (newAddedVehicle && setOpenDropdown) {
      setVehicle(newAddedVehicle);
      setOpenDropdown(false);
    }
  }, [newAddedVehicle]);

  useEffect(() => {
    if (vehicle) {
      useListsStore.setState({ vehicle });
    }
  }, [vehicle]);

  return (
    <>
      <input type="hidden" name={name} value={vehicle?.id ?? ""} />

      <Selector
        label={(vehicle: Vehicle | null) =>
          vehicle ? vehicle.model || `Vehicle ${vehicle.id}` : "Vehicle"
        }
        newButton={<NewVehicle />}
        items={vehicleList}
        onSearch={(search: string) =>
          vehicleList.filter((vehicle) =>
            vehicle.model?.toLowerCase().includes(search.toLowerCase()),
          )
        }
        openState={[openDropdown, setOpenDropdown]}
        selectedItem={vehicle}
        setSelectedItem={setVehicle}
        displayList={(item) => <p>{item.model}</p>}
      />
    </>
  );
}
