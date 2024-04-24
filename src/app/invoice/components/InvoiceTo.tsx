"use client";

import { Customer } from "@prisma/client";
import { useInvoiceStore } from "../../../stores/invoice";
import { usePopupStore } from "../../../stores/popup";
import { FaPlus } from "react-icons/fa";
import { User } from "next-auth";
import { customAlphabet, nanoid } from "nanoid";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function InvoiceTo({
  customers,
  user,
}: {
  customers: Customer[];
  user: User;
}) {
  const {
    invoiceId,
    customer,
    setCustomer,
    issueDate,
    setIssueDate,
    setInvoiceId,
  } = useInvoiceStore();
  const { open } = usePopupStore();
  const params = useParams();

  console.log(params);

  // Generate a new invoice ID
  useEffect(() => {
    // If the invoice is being edited, don't generate a new invoice ID
    if (params.id) return;
    setInvoiceId(customAlphabet("1234567890", 10)());
  }, []);

  return (
    <div className="app-shadow invoice-to h-[63%] w-full rounded-xl p-3">
      <div className="form-head flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase text-black">Invoice to</h2>
        <button
          className="rounded-md bg-[#4DB6AC] px-7 py-2 text-xs text-white"
          onClick={() => open("ADD_CUSTOMER", { customers })}
        >
          <FaPlus />
        </button>
      </div>

      <form className="form mt-5 flex w-full flex-row gap-3">
        <div className="form-divide flex w-[30%] flex-col gap-4 text-sm text-black">
          <label htmlFor="sales-person">Salesperson:</label>
          <label htmlFor="invoice">Invoice ID:</label>
          <label htmlFor="date">Issue Date:</label>
          <label htmlFor="name">Name:</label>
          <label htmlFor="mobile">Mobile:</label>
          <label htmlFor="email">Email:</label>
          <label htmlFor="address">Address:</label>
        </div>

        <div className="form-divide-input flex w-[70%] flex-col gap-3">
          <p className="text-sm font-bold text-black">{user.name}</p>
          <p className="text-sm font-bold text-black">{invoiceId}</p>
          <input
            type="date"
            id="date"
            name="date"
            required
            placeholder="Issue Date"
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={
              // format date so it can be displayed in the input field
              new Date(issueDate).toISOString().split("T")[0]
            }
            onChange={(e) => setIssueDate(e.target.value as any)}
          />
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Name"
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />

          <input
            type="text"
            id="mobile"
            name="mobile"
            required
            placeholder="Mobile"
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={customer.mobile}
            onChange={(e) =>
              setCustomer({ ...customer, mobile: parseInt(e.target.value) })
            }
          />

          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Email"
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={customer.email}
            onChange={(e) =>
              setCustomer({ ...customer, email: e.target.value })
            }
          />

          <input
            type="text"
            id="address"
            name="address"
            required
            placeholder="Address"
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />
          <input
            type="text"
            id="city"
            name="city"
            required
            placeholder="City"
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={customer.city}
            onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
          />
          <div className="flex gap-3">
            <input
              type="text"
              id="state"
              name="state"
              required
              placeholder="State"
              className="app-shadow w-1/2 rounded-md border-none p-1 px-3 text-xs text-black"
              value={customer.state}
              onChange={(e) =>
                setCustomer({ ...customer, state: e.target.value })
              }
            />
            <input
              type="text"
              id="zip"
              name="zip"
              required
              placeholder="Zip"
              className="app-shadow w-1/2 rounded-md border-none p-1 px-3 text-xs text-black"
              value={customer.zip}
              onChange={(e) =>
                setCustomer({ ...customer, zip: e.target.value })
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
}
