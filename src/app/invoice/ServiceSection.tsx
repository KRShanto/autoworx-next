"use client";

import ServiceSearch from "./ServiceSearch";
import Services from "./Services";
import AdditionalInfo from "./AdditionalInfo";
import { useInvoiceStore } from "../../stores/invoice";
import OrderButton from "./OrderButton";
import { useEffect, useState } from "react";
import { Status } from "@/types/db";
import { User } from "next-auth";

export default function ServiceSection({
  allServices,
  notes,
  terms,
  user,
}: {
  allServices: any[];
  notes: string;
  terms: string;
  user: User;
}) {
  const {
    pricing,
    setPricing,
    status,
    setStatus,
    sendMail,
    setSendMail,
    services,
    payments,
    photo,
    setPhoto,
  } = useInvoiceStore();

  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "AMOUNT">(
    "PERCENTAGE",
  );

  useEffect(() => {
    // subtotal would be the sum of all services
    // const subtotal = services.reduce((acc, service) => acc + service.total, 0);
    // cast to number and then sum
    const subtotal = services
      .map((service) => Number(service.total))
      .reduce((acc, total) => acc + total, 0);
    let gt;

    // calculate grand total with tax
    if (pricing.tax > 0) {
      gt = subtotal + subtotal * (pricing.tax / 100);
    } else {
      gt = subtotal;
    }

    // calculate grand total with discount
    if (discountType === "PERCENTAGE") {
      gt = gt - subtotal * ((pricing.discount ? pricing.discount : 0) / 100);
    } else {
      gt = gt - (pricing.discount ? pricing.discount : 0);
    }

    // calculate due
    const due = gt - (pricing.deposit ? pricing.deposit : 0);

    setPricing({
      ...pricing,
      subtotal,
      grand_total: gt,
      due,
    });
  }, [
    services,
    payments,
    pricing.subtotal,
    pricing.discount,
    pricing.tax,
    pricing.deposit,
    discountType,
  ]);

  return (
    <div className="app-shadow h-[76%] w-full rounded-xl p-3">
      <ServiceSearch allServices={allServices} />
      <Services />

      {/* Attachments */}
      <div className="attach mt-3 flex h-40 gap-4">
        {/* Photo selector */}
        {/* TODO */}
        <div className="invoice-inner-shadow relative flex h-full w-[75%] flex-col items-center justify-center bg-[#EFEFEF] max-[1700px]:w-[65%]">
          <p className="text-[75px] font-normal text-[#797979]">+</p>
          <p className="relative bottom-8 text-xl text-[#797979]">
            {photo ? photo.name : "Click to attach photo/document"}
          </p>
          <input
            type="file"
            className="absolute h-full w-full cursor-pointer opacity-0"
            onChange={(e) =>
              setPhoto(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        {/* Info */}
        <div className="relative flex w-[20%] max-[1700px]:w-[35%]">
          {/* Titles */}
          <div className="flex w-[50%] flex-col text-[12px] font-bold uppercase text-black">
            <h2 className="bg-[#EAEAEA] p-1">Subtotal</h2>
            <h2 className="mt-[1px] bg-[#EAEAEA] p-1">Discount</h2>
            <h2 className="mt-[1px] bg-[#EAEAEA] p-1">Tax</h2>
            <h2 className="mt-[1px] bg-[#EAEAEA] p-1">Grand Total</h2>
            <h2 className="mt-[1px] bg-[#EAEAEA] p-1">Deposit</h2>
            <h2 className="mt-[1px] bg-[#EAEAEA] p-1">Due</h2>
          </div>
          {/* Values */}
          <div className="flex w-[50%] flex-col text-[12px]">
            <input
              type="number"
              className="border-none bg-[#F4F4F4] px-1 py-[5px] text-xs"
              value={pricing.subtotal}
              disabled
            />

            <div className="flex w-full">
              <input
                type="number"
                className="mt-[1px] w-[60%] border-none bg-[#F4F4F4] px-1 py-[5px] text-xs"
                value={pricing.discount}
                onChange={(e) =>
                  setPricing({ ...pricing, discount: parseInt(e.target.value) })
                }
              />
              <select
                name="discount_type"
                id="discount_type"
                className="w-[40%] border-none bg-[#F4F4F4] px-1 py-[5px] text-xs"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
              >
                <option value="PERCENTAGE">%</option>
                <option value="AMOUNT">$</option>
              </select>
            </div>

            <input
              type="number"
              className="mt-[1px] border-none bg-[#F4F4F4] px-1 py-[5px] text-xs"
              value={pricing.tax}
              onChange={(e) =>
                setPricing({ ...pricing, tax: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              className="mt-[1px] border-none bg-[#F4F4F4] px-1 py-[5px] text-xs"
              value={pricing.grand_total}
              disabled
            />
            <input
              type="number"
              className="mt-[1px] border-none bg-[#F4F4F4] px-1 py-[5px] text-xs"
              value={pricing.deposit}
              onChange={(e) =>
                setPricing({ ...pricing, deposit: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              className="mt-[1px] border-none bg-[#F4F4F4] px-1 py-[5px] text-xs"
              value={pricing.due}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Notes, Terms, Policy, Create order */}
      <div className="mt-3 flex flex-row gap-4">
        <AdditionalInfo notes={notes} terms={terms} />
        {/* Create order button */}
        <div className="service-form w-[23%]">
          {/* Select Status */}
          <select
            name="status"
            id="status"
            className="app-shadow h-7 w-full rounded-md border-none p-1 px-2 text-sm text-black"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="Consultations">Consultations</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In progress</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Pending">Pending</option>
            <option value="No show">No Show</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Checkbox */}
          <div className="checkbox mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="send-email"
              id="send-email"
              className="app-shadow h-4 w-4 rounded-sm border-none bg-[#F4F4F4] text-[#03A7A2]"
              checked={sendMail}
              onChange={(e) => setSendMail(e.target.checked)}
            />
            <label htmlFor="send-email">Send Email</label>
          </div>

          <OrderButton user={user} />
        </div>
        <div></div>
      </div>
    </div>
  );
}
