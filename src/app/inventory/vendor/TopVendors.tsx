import { db } from "@/lib/db";
import React from "react";

export default async function TopVendors() {
  const vendors = await db.vendor.findMany({
    select: {
      inventoryProducts: true,
      id: true,
      name: true,
      companyName: true,
    },
  });

  // sum up the total inventory products price * quantity for each vendor
  const topVendors = vendors
    .map((vendor) => {
      const total = vendor.inventoryProducts.reduce((acc, product) => {
        return acc + ((product.price as any) || 0) * (product.quantity || 0);
      }, 0);

      return {
        total,
        name: vendor.name,
        companyName: vendor.companyName,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return (
    <div className="app-shadow h-[45%] w-full rounded-lg bg-white p-5">
      <h3 className="text-xl font-bold">Top Vendors</h3>

      <div className="flex h-[90%] flex-col gap-3 overflow-y-auto p-3">
        {topVendors
          .sort((a, b) => b.total - a.total)
          .map((vendor, i) => (
            <div key={i} className="flex items-center justify-between">
              <p className="text-sm">
                {vendor.name}, {vendor.companyName}
              </p>
              {/* progress bar */}
              <div className="h-2 w-[50%] rounded-md bg-gray-200">
                <div
                  className="h-2 rounded-md bg-[#6571FF]"
                  style={{
                    width: `${(vendor.total / topVendors[0].total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
