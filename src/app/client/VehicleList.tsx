"use client";
import { cn } from "@/lib/cn";
import React from "react";
import NewVehicle from "@/components/Lists/NewVehicle";
import { Vehicle } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
