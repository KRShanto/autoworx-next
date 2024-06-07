import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import React from "react";
import Table from "./Table";
import Details from "./Details";
import Title from "@/components/Title";
import NewVendor from "@/components/Lists/NewVendor";

export default async function Page({
  searchParams: { vendorId },
}: {
  searchParams: { vendorId: string };
}) {
  const companyId = await getCompanyId();
  const vendors = await db.vendor.findMany({
    where: { companyId },
  });

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <Title>Vendor List</Title>
        {/* <button className="rounded-md bg-[#6571FF] p-2 px-8 text-white">
          Add New Vendor
        </button> */}
        <NewVendor
          button={
            <button className="rounded-md bg-[#6571FF] p-2 px-8 text-white">
              Add New Vendor
            </button>
          }
        />
      </div>

      <div className="mt-5 flex h-full gap-3">
        <Table vendors={vendors} vendorId={parseInt(vendorId)} />
        <Details vendor={vendors.find((v) => v.id === parseInt(vendorId))} />
      </div>
    </div>
  );
}
