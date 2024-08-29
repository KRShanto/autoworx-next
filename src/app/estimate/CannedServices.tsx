"use client";
import NewVehicle from "@/components/Lists/NewVehicle";
import { cn } from "@/lib/cn";
import { Vehicle } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import NewLabor from "./NewLabor";
import NewService from "./NewService";

export default function CannedServices() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="h-full w-full space-y-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <h3 className="text-2xl font-bold">Canned Services</h3>
        </div>
        <NewService
          newButton={
            <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
              + Add Service
            </button>
          }
        />
      </div>
      {/* TODO: make it scrollable */}
      <div className="">
        <table className="w-full">
          <thead>
            <tr className="h-10 border-b">
              <th className="px-4 text-left 2xl:px-10">Service Name</th>
              <th className="px-4 text-left 2xl:px-10">Category</th>
              <th className="px-4 text-left 2xl:px-10">Description</th>
              <th className="px-4 text-left 2xl:px-10">Edit</th>
            </tr>
          </thead>

          <tbody className="border border-gray-200">
            <tr
              className={cn(
                "cursor-pointer rounded-md py-3",
                // index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]",
                // vehicleId &&
                //   vehicleId === vehicle?.id &&
                //   "border-2 border-[#6571FF]",
              )}
            >
              <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
                Labor 1
              </td>
              <td className="text-nowrap px-4 py-1 text-left 2xl:px-10">
                Category 1
              </td>
              <td className="px-4 py-1 text-left 2xl:px-10">$4567</td>
              <td className="flex items-center gap-x-4 px-4 py-1 text-left 2xl:px-10">
                <button className="text-[#6571FF]">
                  <RiEditFill />
                </button>
                <button className="text-red-400">
                  <FaTimes />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
