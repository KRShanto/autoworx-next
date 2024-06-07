import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import React from "react";
import Table from "./Table";
import Details from "./Details";

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
    <div className="flex h-full gap-3 overflow-scroll">
      <Table vendors={vendors} vendorId={parseInt(vendorId)} />
      <Details vendor={vendors.find((v) => v.id === parseInt(vendorId))} />
    </div>
  );
}
