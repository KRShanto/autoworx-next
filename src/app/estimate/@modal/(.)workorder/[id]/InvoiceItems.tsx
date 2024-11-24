"use client";

import { cn } from "@/lib/cn";
import type { db } from "@/lib/db";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import LaborItems from "./LaborItems";
import ReDoModal from "./ReDoModal";

type TProps = {
  items: Awaited<
    ReturnType<
      typeof db.invoiceItem.findMany<{
        include: {
          service: {
            include: {
              Technician: {
                include: {
                  user: {
                    select: {
                      firstName: true;
                    };
                  };
                };
              };
            };
          };
          materials: true;
          labor: true;
        };
      }>
    >
  >;
};

export function InvoiceItems({ items }: TProps) {
  const [openService, setOpenService] = useState<number | null>(null);
  return items.map((item) => {
    if (!item.service) return null;
    return (
      <div
        key={item.id}
        className="overflow-y-auto rounded-md border border-[#6571FF] py-2"
      >
        <div
          className={cn(
            "flex w-full cursor-pointer justify-between text-[#6571FF]",
            openService && "border-b py-2",
          )}
          onClick={() =>
            setOpenService(openService === item.id ? null : item.id)
          }
        >
          <p className="px-5">{item.service.name}</p>
          <div className="mr-5 flex items-center space-x-3">
            <ReDoModal
              invoiceId={item?.invoiceId as string}
              serviceId={item?.serviceId as number}
              technicians={item.service.Technician}
            />
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
        </div>

        {openService === item.id && (
          <div className="my-2 grid w-full grid-cols-1 gap-1 text-[#6571FF]">
            {item.materials.map((material, index) => (
              <div key={index} className="ml-10">
                <p className="capitalize">{material.name}</p>
              </div>
            ))}

            <div className="ml-10">
              <p className="font-bold capitalize">{item.labor?.name}</p>
            </div>

            <LaborItems
              invoiceId={item?.invoiceId as string}
              serviceId={item?.serviceId as number}
            />
          </div>
        )}
      </div>
    );
  });
}
