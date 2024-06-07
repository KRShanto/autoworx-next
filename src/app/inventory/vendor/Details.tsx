import { Vendor } from "@prisma/client";
import React from "react";

export default function Details({ vendor }: { vendor: Vendor | undefined }) {
  return (
    <div className="app-shadow h-[50%] w-[30%] rounded-lg bg-white p-5">
      <h3 className="text-xl font-bold">Vendor Details</h3>

      {vendor === undefined ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="">Select a vendor to view details</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-3">
          <p>Contact Name: {vendor.name}</p>
          <p>Company Name: {vendor.companyName}</p>
          <p>Phone: {vendor.phone}</p>
          <p>Email: {vendor.email}</p>
          <p>Address: {vendor.address}</p>
          <p>City: {vendor.city}</p>
          <p>State: {vendor.state}</p>
          <p>Zip: {vendor.zip}</p>
          <p>Website: {vendor.website}</p>
        </div>
      )}
    </div>
  );
}
