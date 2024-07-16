"use client";

import { cn } from "@/lib/cn";
import type { db } from "@/lib/db";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import LaborItems from "./LaborItems";

export function InvoiceItems({
  items,
  workOrderId,
}: {
  items: Awaited<
    ReturnType<
      typeof db.invoiceItem.findMany<{
        include: {
          service: true;
          materials: true;
          labor: true;
        };
      }>
    >
  >;
  workOrderId: string;
}) {
  const [openService, setOpenService] = useState<number | null>(null);
  console.log({ items });
  return items.map((item) => {
    if (!item.service) return null;

    return (
      <div
        key={item.id}
        className="overflow-y-auto rounded-md border border-[#6571FF] py-1"
      >
        <div
          className={cn(
            "flex w-full justify-between text-[#6571FF]",
            openService && "border-b py-2",
          )}
        >
          <p className="px-5">{item.service.name}</p>
          <button
            type="button"
            onClick={() =>
              setOpenService(openService === item.id ? null : item.id)
            }
            className="mr-5 flex items-center gap-1"
          >
            {openService === item.id ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {openService === item.id && (
          <div className="my-2 grid w-full grid-cols-1 gap-3 text-[#6571FF]">
            {/* TODO */}
            {item.materials.map((material, index) => {
              console.log(material);
              if (!material) return null;
              return (
                <React.Fragment key={index}>
                  <div className="ml-10">
                    <p className="capitalize">{material.name}</p>
                  </div>
                  <LaborItems
                    workOrderId={Number(workOrderId)}
                    materialId={material.id}
                    serviceId={item?.serviceId as number}
                    labor={item.labor}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    );
  });
}
