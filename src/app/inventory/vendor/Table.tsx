"use client";

import EditVendor from "@/components/Lists/EditVendor";
import { cn } from "@/lib/cn";
import { Vendor } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default function Table({
  vendors,
  vendorId,
}: {
  vendors: Vendor[];
  vendorId: number;
}) {
  const router = useRouter();

  return (
    <div className="h-[90%] w-[70%] overflow-scroll">
      <table className="w-[98%]">
        <thead className="bg-white">
          <tr className="h-10 border-b">
            <th className="px-10 text-left">#</th>
            <th className="px-10 text-left">Name</th>
            <th className="px-10 text-left">Phone</th>
            <th className="px-10 text-left">Website</th>
            <th className="px-10 text-left">Join Date</th>
            <th className="px-10 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor, index) => (
            <tr
              key={vendor.id}
              className={cn(
                "cursor-pointer rounded-md py-3",
                index % 2 === 0 ? evenColor : oddColor,
                vendorId === vendor.id && "border-2 border-[#6571FF]",
              )}
              onClick={() =>
                router.push(`/inventory/vendor?vendorId=${vendor.id}`)
              }
            >
              <td className="h-12 px-10 text-left">
                <p>{vendor.id}</p>
              </td>
              <td className="text-nowrap px-10 text-left">{vendor.name}</td>
              <td className="text-nowrap px-10 text-left">{vendor.phone}</td>
              <td className="px-10 text-left">{vendor.website}</td>
              <td className="px-10 text-left">
                {moment(vendor.createdAt).format("DD MMM YYYY, hh:mm A")}
              </td>
              <td className="mt-2 flex gap-3 px-10">
                
                <EditVendor button={
                <button className="text-2xl text-blue-600">
                  <CiEdit />
                </button>
                }
                vendor={vendor}
                />
                <button className="text-xl text-red-400">
                  <FaTimes />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
