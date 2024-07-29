"use client";
import { cn } from "@/lib/cn";
import React from "react";
import NewVehicle from "@/components/Lists/NewVehicle";

export default function VehicleList({
  vehicles,
  selectedVehicle,
  setSelectedVehicle,
}: {
  vehicles: any[];
  selectedVehicle: any;
  setSelectedVehicle: any;
}) {
  return (
    <div className="h-full w-full space-y-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <h3 className="text-lg font-semibold">Vehicle List</h3>
        </div>
        <NewVehicle />
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
                  selectedVehicle?.id === vehicle?.id &&
                    "border-2 border-[#6571FF]",
                )}
                onClick={() => {
                  setSelectedVehicle(vehicle);
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
                  {vehicle.plate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
