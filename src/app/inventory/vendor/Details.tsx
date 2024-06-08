import { Vendor } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default function Details({ vendor }: { vendor: Vendor | undefined }) {
  return (
    <div className="app-shadow h-[45%] w-full rounded-lg bg-white p-5">
      <h3 className="text-xl font-bold">Vendor Details</h3>

      {vendor === undefined ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="">Select a vendor to view details</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 p-3">
          <p>Contact Name: {vendor.name}</p>
          <p>Company Name: {vendor.companyName}</p>
          <p>Phone: {vendor.phone}</p>
          <p>Email: {vendor.email}</p>
          <p>Address: {vendor.address}</p>
          <p>City: {vendor.city}</p>
          <p>State: {vendor.state}</p>
          <p>Zip: {vendor.zip}</p>
          <p>Website: {vendor.website}</p>
          <div className="flex justify-end">
            <Link
              href={`/inventory/vendor/${vendor.id}/history`}
              className="rounded-md border border-[#6571FF] p-2 px-5 text-[#6571FF]"
            >
              View Purchase History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
