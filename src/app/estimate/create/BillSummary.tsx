"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEffect } from "react";
import DepositCreate from "./DepositCreate";
import MakePayment from "./MakePayment";

export function BillSummary() {
  const {
    items,
    subtotal,
    discount,
    grandTotal,
    tax,
    deposit,
    due,
    depositMethod,
    depositNotes,
  } = useEstimateCreateStore();
  const {
    setSubtotal,
    setDiscount,
    setGrandTotal,
    setTax,
    setDeposit,
    setDue,
    setDepositMethod,
    setDepositNotes,
  } = useEstimateCreateStore();

  useEffect(() => {
    let newServicesTotal = 0;
    let newDiscountTotal = 0;

    items.forEach((item) => {
      const { service, material, labor } = item;

      if (!service) return;

      const materialCost = material?.sell
        ? parseFloat(material.sell.toString()) * material.quantity!
        : 0;
      const laborCost = labor?.charge
        ? parseFloat(labor.charge.toString()) * labor.hours!
        : 0;

      newServicesTotal += materialCost + laborCost;
      newDiscountTotal +=
        (material?.discount ? parseFloat(material.discount.toString()) : 0) +
        (labor?.discount ? parseFloat(labor.discount.toString()) : 0);
    });

    setSubtotal(newServicesTotal);
    setDiscount(newDiscountTotal);
  }, [items]);

  useEffect(() => {
    let newGrandTotal = subtotal;

    if (tax > 0) {
      newGrandTotal += subtotal * (tax / 100);
    }

    if (discount > 0) {
      newGrandTotal -= discount;
    }

    setGrandTotal(newGrandTotal);
  }, [subtotal, discount, tax]);

  useEffect(() => {
    const newDue = grandTotal - deposit;
    setDue(newDue);
  }, [grandTotal, deposit]);

  return (
    <>
      <div className="space-y-2 p-2">
        {[
          ["subtotal", subtotal, setSubtotal],
          ["discount", discount, setDiscount],
          ["tax", tax, setTax],
          ["grand total", grandTotal, setGrandTotal],
          ["deposit", deposit, setDeposit],
          ["due", due, setDue],
        ].map(([title, data, setData], index) => (
          <div
            key={index}
            className="relative flex items-center rounded-md border border-solid border-slate-600"
          >
            <div className="mr-auto px-2 py-1 text-xs uppercase">
              {title as string}
            </div>
            <input
              type="text"
              value={data as string}
              onChange={(e) =>
                // @ts-ignore
                setData(e.target.value)
              }
              className="w-[100px] rounded-md bg-slate-500 px-2 py-1 text-xs text-white"
            />
            {title === "deposit" && (
              <DepositCreate
                deposit={deposit}
                method={depositMethod}
                setDeposit={setDeposit}
                setMethod={setDepositMethod}
                depositNotes={depositNotes}
                setDepositNotes={setDepositNotes}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-1 rounded-md bg-[#006d77] p-2 px-4 text-sm text-white">
        <dl className="flex justify-between">
          <dt>Grand Total</dt> <dd>${grandTotal}</dd>
        </dl>
        <MakePayment />
      </div>
    </>
  );
}
