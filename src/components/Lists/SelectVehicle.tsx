"use client";

import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { Vehicle } from "@prisma/client";
import {  useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import NewVehicle from "./NewVehicle";
import { SelectProps } from "./select-props";

export function SelectVehicle({
  name = "vehicleId",
  value = null,
  setValue,
  openDropdown,
  setOpenDropdown,
  invoice = null,
}: SelectProps<Vehicle | null>) {
  const state = useState(value);
  const [vehicle, setVehicle] = setValue ? [value, setValue] : state;
  const vehicleList = useListsStore((x) => x.vehicles);
  const { newAddedVehicle } = useListsStore();

  const search = useSearchParams();
  const clientId = search.get("clientId");

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

  // Select vehicle when client changes
  // Select the first vehicle that belongs to the client
  // If there are no vehicles, set vehicle to null

  useEffect(() => {
    const clientVehicles = clientId
      ? vehicleList.filter((vehicle) => vehicle.clientId === +clientId)
      : [];
    if (clientId && !invoice) {
      if (clientVehicles.length > 0) {
        setVehicle(clientVehicles[0]);
      } else {
        setVehicle(null);
      }
    } else if (invoice && clientId) {
      // TODO: Fetch vehicle from estimate
      const findVehicleInEstimate = vehicleList.find(
        (vehicle) =>
          vehicle.id === invoice?.vehicleId && vehicle.clientId === +clientId,
      );
      if (findVehicleInEstimate) {
        setVehicle(findVehicleInEstimate);
      } else {
        if (clientVehicles.length > 0) {
          setVehicle(clientVehicles[0]);
        } else {
          setVehicle(null);
        }
      }
    }
  }, [clientId, vehicleList]);

  return (
    <>
      <input type="hidden" name={name} value={vehicle?.id ?? ""} />

      <Selector
        disabledDropdown={clientId && !vehicle?.fromRequest ? false : true}
        label={(vehicle: Vehicle | null) =>
          vehicle
            ? `${vehicle.year?.toString()} ${vehicle?.make} ${vehicle?.model}`
            : "Vehicle"
        }
        newButton={<NewVehicle />}
        items={vehicleList.filter((vehicle) => vehicle.clientId === +clientId!)}
        onSearch={(search: string) =>
          vehicleList.filter((vehicle) =>
            vehicle.model?.toLowerCase().includes(search.toLowerCase()),
          )
        }
        openState={[
          openDropdown as boolean,
          setOpenDropdown as Dispatch<SetStateAction<boolean>>,
        ]}
        selectedItem={vehicle}
        setSelectedItem={setVehicle}
        displayList={(item) => {
          return (
            <p>{`${item.year?.toString()} ${item?.make} ${item?.model}`}</p>
          );
        }}
      />
    </>
  );
}
