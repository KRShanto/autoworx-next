"use client";

import { useInvoiceStore } from "../../../stores/invoice";
import { usePopupStore } from "../../../stores/popup";
import moment from "moment";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";

export default function Payment() {
  const { open } = usePopupStore();
  const { payments, removePayment, pricing, setPricing } = useInvoiceStore();

  useEffect(() => {
    // calculate only diposit payments (type === "Deposit")
    const deposit = payments.reduce((acc, payment) => {
      if (payment.type === "Deposit") {
        return acc + payment.amount;
      }
      return acc;
    }, 0);

    setPricing({ ...pricing, deposit: deposit });
  }, [payments]);

  return (
    <div className="app-shadow payment h-[25%] w-full rounded-xl p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase text-black">
          Payment Order
        </h2>
        <button
          className="rounded-md bg-[#4DB6AC] px-7 py-2 text-sm text-white"
          onClick={() => open("ADD_PAYMENT")}
        >
          Payment
        </button>
      </div>

      {/* Table */}
      <div className="payment-table mt-3 h-24 overflow-scroll">
        <table className="w-full table-fixed">
          <thead>
            <tr className="flex gap-1 text-xs uppercase text-white">
              <th className="w-[150px] bg-[#6571FF] p-2 text-left">
                Billing By
              </th>
              <th className="w-[360px] bg-[#6571FF] p-2 text-left">
                Billing Info
              </th>
              <th className="w-[360px] bg-[#6571FF] p-2 text-left">Note</th>
              <th className="w-[150px] bg-[#6571FF] p-2 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment, index) => {
              const isEven = index % 2 === 0;
              const bgColor = !isEven ? "bg-[#F4F4F4]" : "bg-[$EAEAEA]";

              return (
                <tr className="flex gap-1 text-sm text-black" key={index}>
                  <td className={`text-left ${bgColor} w-[150px] p-2`}>
                    <p>
                      <span className="font-bold">TNX: </span>
                      <span>{payment.tnx}</span>
                    </p>
                    <p>
                      <span className="font-bold">Method: </span>
                      <span>{payment.method}</span>
                    </p>
                    <p>
                      <span className="font-bold">Date: </span>
                      <span>{moment(payment.date).format("DD MMM, YYYY")}</span>
                    </p>
                  </td>
                  <td className={`text-left ${bgColor} w-[360px] p-2`}>
                    {/* name, mobile, email */}
                    <p>
                      <span className="font-bold">Name: </span>
                      <span>{payment.name}</span>
                    </p>
                    <p>
                      <span className="font-bold">Mobile: </span>
                      <span>{payment.mobile}</span>
                    </p>
                    <p>
                      <span className="font-bold">Email: </span>
                      <span>{payment.email}</span>
                    </p>
                  </td>
                  <td className={`text-left ${bgColor} w-[360px] p-2`}>
                    {/* type, address, note */}
                    <p>
                      <span className="font-bold">Type: </span>
                      <span>{payment.type}</span>
                    </p>
                    <p>
                      <span className="font-bold">Address: </span>
                      <span>{payment.address}</span>
                    </p>
                    <p>
                      <span className="font-bold">Note: </span>
                      <span>{payment.note}</span>
                    </p>
                  </td>
                  <td className={`text-left ${bgColor} w-[150px] p-2`}>
                    {/* amount, status, delete button */}
                    <p>
                      <span className="font-bold">Amount: </span>
                      <span>{payment.amount}</span>
                    </p>
                    <p>
                      <span className="font-bold">Status: </span>
                      <span>{payment.status}</span>
                    </p>
                    <button
                      className="flex items-center gap-2 rounded-md bg-red-500 p-1 px-3 text-xs font-bold text-white"
                      onClick={() => removePayment(payment.tnx!)}
                    >
                      <FaTrash className="text-xs" />
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
