"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEffect, useState } from "react";

export function BillSummary() {
  const items = useEstimateCreateStore((state) => state.items);

  const [servicesTotal, setServicesTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [tax, setTax] = useState(2);
  const [deposit, setDeposit] = useState(500);
  const [due, setDue] = useState(0);

  useEffect(() => {
    let newServicesTotal = 0;
    let newDiscountTotal = 0;

    items.forEach((item) => {
      const service = item.service;
      const material = item.material;
      const labor = item.labor;

      if (!service) return;

      const materialCost = material?.sell
        ? parseFloat(material.sell.toString()) * material.quantity!
        : 0;

      const laborCost = labor?.charge
        ? parseFloat(labor.charge.toString()) * labor.hours!
        : 0;

      newServicesTotal += materialCost + laborCost;

      newDiscountTotal += material?.discount
        ? parseFloat(material.discount.toString())
        : 0 + parseFloat(labor?.discount?.toString() ?? "0")
          ? parseFloat(labor?.discount?.toString() ?? "0")
          : 0;
    });

    setServicesTotal(newServicesTotal);
    setDiscount(newDiscountTotal);
  }, [items]);

  useEffect(() => {
    let newGrandTotal = servicesTotal;

    if (tax > 0) {
      newGrandTotal += servicesTotal * (tax / 100);
    }

    if (discount > 0) {
      newGrandTotal -= discount;
    }

    setGrandTotal(newGrandTotal);
  }, [servicesTotal, discount, tax]);

  useEffect(() => {
    const newDue = grandTotal - deposit;
    setDue(newDue);
  }, [grandTotal, deposit]);

  return (
    <>
      <div className="space-y-2 p-3">
        {[
          ["subtotal", servicesTotal, setServicesTotal],
          ["discount", discount, setDiscount],
          ["tax", tax, setTax],
          ["grand total", grandTotal, setGrandTotal],
          ["deposit", deposit, setDeposit],
          ["due", due, setDue],
        ].map(([title, data, setData], index) => (
          <div
            key={index}
            className="flex rounded-md border border-solid border-slate-600"
          >
            <div className="mr-auto px-2 py-1 uppercase">{title as string}</div>
            <input
              type="text"
              value={data as string}
              onChange={(e) =>
                // @ts-ignore
                setData(e.target.value)
              }
              className="w-[100px] rounded-md bg-slate-500 px-2 py-1 text-white"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-md bg-[#006d77] p-3 text-white">
        <dl className="flex justify-between">
          <dt>Grand Total</dt> <dd>$0.00</dd>
        </dl>
        <button
          type="button"
          className="w-full rounded-md bg-white p-2 text-[#006d77]"
        >
          Make Payment
        </button>
      </div>
    </>
  );
}
