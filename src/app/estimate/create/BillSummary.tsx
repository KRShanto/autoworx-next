"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useEffect, useState } from "react";
import DepositCreate from "./DepositCreate";
import MakePayment from "./MakePayment";
import { errorToast, successToast } from "@/lib/toast";
import { checkCouponCode } from "@/actions/coupon/checkCouponCode";
import { RotatingLines } from "react-loader-spinner";
import { useListsStore } from "@/stores/lists";
import { usePathname } from "next/navigation";
import { getTotalPayment } from "@/actions/payment/getTotalPayment";
import { getCompanyTaxCurrency } from "@/actions/settings/emailTemplates";


export function BillSummary() {
  const { items, subtotal, discount, grandTotal, tax, deposit, due, coupon } =
    useEstimateCreateStore();
  const {
    setSubtotal,
    setDiscount,
    setGrandTotal,
    setTax,
    setDeposit,
    setDue,
    setCoupon,
    invoiceId,
  } = useEstimateCreateStore();
  const { client } = useListsStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let newServicesTotal = 0;
    let newDiscountTotal = 0;

    items.forEach((item) => {
      const { service, materials, labor } = item;

      if (!service) return;

      // total material cost
      const materialCost = materials.reduce((acc, material) => {
        return (
          acc +
          (material && material.sell
            ? parseFloat(material.sell.toString()) * material.quantity!
            : 0)
        );
      }, 0);
      // total material discount
      const materialDiscount = materials.reduce((acc, material) => {
        return (
          acc +
          (material && material.discount
            ? parseFloat(material.discount.toString()) * material.quantity!
            : 0)
        );
      }, 0);
      const laborCost = labor?.charge
        ? parseFloat(labor.charge.toString()) * labor.hours!
        : 0;

      newServicesTotal += materialCost + laborCost;
      newDiscountTotal +=
        materialDiscount +
        (labor?.discount ? parseFloat(labor.discount.toString()) : 0);
    });

    setSubtotal(newServicesTotal);
    setDiscount(newDiscountTotal);
  }, [items]);

  useEffect(() => {
    let netAmount = subtotal - discount;

    let newGrandTotal = netAmount;
    if (tax > 0) {
      newGrandTotal += netAmount * (tax / 100);
    }

    setGrandTotal(newGrandTotal);
  }, [subtotal, discount, tax]);

  useEffect(() => {
    const newDue = grandTotal - deposit;
    setDue(newDue);
  }, [grandTotal, deposit]);

  async function checkCoupon() {
    if (!couponInput || !client) return;

    setCouponLoading(true);
    const res = await checkCouponCode({
      code: couponInput,
      clientId: client?.id,
    });

    if (res.type === "success") {
      successToast("Coupon applied successfully");
      setCoupon(res.data);
      setDiscount(
        Number(discount) +
          Number(res.data.discount) -
          Number(coupon ? coupon.discount : 0),
      );
    } else {
      errorToast(res.message!);
    }

    setCouponLoading(false);
  }
  useEffect(() => {
    async function fetchTotalPayment() {
      if (invoiceId) {
        const totalPayment = await getTotalPayment(invoiceId);
        setDeposit(totalPayment);
      }
    }

    fetchTotalPayment();
  }, [invoiceId, setDeposit]);
  
 useEffect(() => {
    async function fetchTax() {
      const tax = await getCompanyTaxCurrency();
      setTax(tax.tax);
    }

    fetchTax();

 },[setTax]);


    fetchTotalPayment();
  }, [invoiceId, setDeposit]);
  
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
              readOnly={title === "deposit"}
            />
            {/* {title === "deposit" && (
              <DepositCreate
                deposit={deposit}
                method={depositMethod}
                setDeposit={setDeposit}
                setMethod={setDepositMethod}
                depositNotes={depositNotes}
                setDepositNotes={setDepositNotes}
              />
            )} */}
          </div>
        ))}
      </div>

      <div className="space-y-1 rounded-md bg-[#006d77] p-2 px-4 text-sm text-white">
        <dl className="flex justify-between">
          <dt>Grand Total</dt> <dd>${subtotal}</dd>
        </dl>

        {/* Coupon code */}
        {pathname.includes("/estimate/create") && (
          <div className="flex justify-between rounded-md border p-1">
            <input
              type="text"
              placeholder="Add Coupon"
              className="w-full bg-transparent p-2 focus:outline-none"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            {couponLoading ? (
              <>
                <RotatingLines width="24" strokeColor="#fff" />
              </>
            ) : (
              <button
                className="rounded-md p-2 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                onClick={checkCoupon}
                disabled={!client}
                title={!client ? "Please select a client" : undefined}
              >
                Apply
              </button>
            )}
          </div>
        )}
        <MakePayment />
      </div>
    </>
  );
}
