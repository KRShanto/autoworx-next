"use client";

import type { db } from "@/lib/db";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

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

  return items.map((item) => {
    if (!item.service) return null;

    return (
      <div
        key={item.id}
        className="rounded-md border border-[#6571FF] px-5 py-1"
      >
        <div className="flex w-full justify-between text-[#6571FF]">
          <p>{item.service.name}</p>
          <button
            type="button"
            onClick={() =>
              setOpenService(openService === item.id ? null : item.id)
            }
            className="flex items-center gap-1"
          >
            {openService === item.id ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {openService === item.id && (
          <div className="my-2 grid grid-cols-2 gap-3 text-[#6571FF]">
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
            <p></p>
          </div>
        )}
      </div>
    );
  });
}
