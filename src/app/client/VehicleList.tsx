"use client";
import { deleteVehicle } from "@/actions/vehicle/editVehicle";
import EditVehicle from "@/components/Lists/EditVehicle";
import NewVehicle from "@/components/Lists/NewVehicle";
import { cn } from "@/lib/cn";
import { Vehicle, VehicleColor } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FaTimes } from "react-icons/fa";

export default function VehicleList({
  clientId,
  vehicles,
}: {
  clientId: number;
  vehicles: Vehicle[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = Number(searchParams.get("vehicleId"));

  return (
    <div className="h-full w-full space-y-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <h3 className="text-lg font-semibold">Vehicle List</h3>
        </div>
        <NewVehicle
          newButton={
            <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
              + Add New Vehicle
            </button>
          }
        />
      </div>
      {/* TODO: make it scrollable */}
      <div className="">
        <table className="w-full">
          <thead>
            <tr className="h-10 border-b">
              <th className="px-4 text-left 2xl:px-10">Year</th>
              <th className="px-4 text-left 2xl:px-10">Make</th>
              <th className="px-4 text-left 2xl:px-10">Model</th>
              <th className="px-4 text-left 2xl:px-10">Plate</th>
              <th className="px-4 text-left 2xl:px-10">Actions</th>
            </tr>
          </thead>

          <tbody className="border border-gray-200">
            {vehicles.map((vehicle, index) => (
              <tr
                key={index}
                className={cn(
                  "cursor-pointer rounded-md py-3",
                  index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
                  vehicleId &&
                    vehicleId === vehicle?.id &&
                    "border-2 border-[#6571FF]",
                )}
                onClick={() => {
                  router.push(`/client/${clientId}?vehicleId=${vehicle.id}`);
                }}
              >
                <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
                  {vehicle.year}
                </td>
                <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
                  {vehicle.make}
                </td>
                <td className="px-4 py-1 text-left 2xl:px-10">
                  {vehicle.model}
                </td>
                <td className="px-4 py-1 text-left 2xl:px-10">
                  {vehicle.license}
                </td>
                <td className="px-4 py-1 text-left 2xl:px-10">
                  <div className="flex items-center gap-x-4 text-xl">
                    {" "}
                    <EditVehicle vehicle={vehicle} />
                    <button
                      type="button"
                      onClick={() => {
                        deleteVehicle(vehicle.id, clientId);
                      }}
                      className="text-xs text-red-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
