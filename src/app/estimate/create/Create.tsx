"use client";

import { useEstimatePopupStore } from "@/stores/estimate-popup";
import ServiceCreate from "./ServiceCreate";
import MaterialCreate from "./MaterialCreate";
import LaborCreate from "./LaborCreate";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function Create() {
  const { type } = useEstimatePopupStore();
  const [openService, setOpenService] = useState<string | null>(null);
  const items = useEstimateCreateStore((x) => x.items);

  if (type === "SERVICE") return <ServiceCreate />;
  if (type === "MATERIAL") return <MaterialCreate />;
  if (type === "LABOR") return <LaborCreate />;

  return (
    <div className="w-full space-y-3 overflow-y-auto p-3">
      {items.map((item) => {
        if (!item.service) return null;
        const materialCost = item.materials.reduce((acc, material) => {
          return (
            acc +
            (material && material.sell
              ? parseFloat(material.sell.toString()) * material.quantity!
              : 0)
          );
        }, 0);

        const laborCost = item.labor?.charge
          ? parseFloat(item.labor?.charge.toString()) * item.labor?.hours!
          : 0;

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
                  setOpenService(
                    openService === item.id ? null : (item.id as string),
                  )
                }
                className="flex items-center gap-1"
              >
                <p>${materialCost + laborCost}</p>
                {openService === item.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {openService === item.id && (
              <>
                <div className="mt-2 text-[#6571FF]">
                  <div className="">
                    {item.materials.map((material, index) => {
                      if (!material) return null;

                      return (
                        <div key={index} className="flex justify-between">
                          <p>{material.name}</p>
                          <p>
                            ${" "}
                            {material.sell
                              ? parseFloat(material.sell.toString()) *
                                material.quantity!
                              : 0}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 text-[#6571FF]">
                  <div className="flex justify-between">
                    <p>{item.labor ? item.labor.name : "Labor"}</p>
                    <p>
                      $
                      {item.labor?.charge
                        ? parseFloat(item.labor?.charge.toString()) *
                          item.labor?.hours!
                        : 0}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
