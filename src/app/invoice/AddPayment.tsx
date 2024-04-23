"use client";

import { usePopupStore } from "../../stores/popup";
import Popup from "@/components/Popup";
import { useInvoiceStore } from "../../stores/invoice";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function AddPayment() {
  const { close } = usePopupStore();
  const { pricing, addPayment } = useInvoiceStore();

  const [type, setType] = useState<"Payment" | "Refund" | "Deposit">("Payment");
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<"Cash" | "Card" | "Zelle">("Cash");
  const [note, setNote] = useState("");

  useEffect(() => {
    setAmount(pricing.due);
  }, [pricing.due]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await addPayment({
      amount,
      method,
      note,
      type,
    });
    close();
  };

  return (
    <Popup>
      <div className="w-[30rem] px-2 py-3">
        <div className="flex items-center justify-between px-3 py-1">
          <h2 className="text-xl font-bold">Payment</h2>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-md border p-2"
            >
              <option value="Payment">Payment</option>
              <option value="Deposit">Deposit</option>
              <option value="Refund">Refund</option>
            </select>
          </div>

          <div className="mt-2">
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full rounded-md border p-2"
              placeholder="Amount"
            />
          </div>

          <div className="mt-2">
            <select
              name="method"
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full rounded-md border p-2"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Zelle">Zelle</option>
            </select>
          </div>

          <div className="mt-2">
            <textarea
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Note"
            />
          </div>

          <button
            className="mx-auto mt-2 block rounded-md bg-blue-500 px-6 py-2 text-white active:scale-95"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </Popup>
  );
}
