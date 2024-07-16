"use client";

import { cn } from "@/lib/cn";
import type { db } from "@/lib/db";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import LaborItems from "./LaborItems";

export function InvoiceItems({
  items,
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
}) {
  const [openService, setOpenService] = useState<number | null>(null);
  console.log(items);
  return items.map((item) => {
    if (!item.service) return null;

    return (
      <div key={item.id} className="rounded-md border border-[#6571FF] py-1">
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
              if (!material) return null;
              return (
                <div
                  key={index}
                  className="rounded-md border border-solid border-[#6571FF] p-2"
                >
                  <p>{material.name}</p>
                </div>
              );
            })}
            <LaborItems lober={item.labor} />
          </div>
        )}
      </div>
    );
  });
}
