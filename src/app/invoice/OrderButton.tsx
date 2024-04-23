"use client";

import { ThreeDots } from "react-loader-spinner";
import { useInvoiceStore } from "../../stores/invoice";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "next-auth";
import { createInvoice } from "./create/create";
import { useFormErrorStore } from "@/stores/form-error";
import { editInvoice } from "./edit/edit";

export default function OrderButton({ user }: { user: User }) {
  const pathname = usePathname();
  const lastPath = pathname.split("/").pop();
  const [loading, setLoading] = useState(false);
  const {
    invoiceId,
    customer,
    vehicle,
    services,
    pricing,
    additional,
    status,
    sendMail,
    issueDate,
    payments,
    photo,
    reset,
    tags,
  } = useInvoiceStore();
  const { showError } = useFormErrorStore();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = {
      invoiceId,

      customer: {
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
      },

      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        license: vehicle.license,
      },

      pricing: {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        tax: pricing.tax,
        grandTotal: pricing.grand_total,
        deposit: pricing.deposit,
        due: pricing.due,
      },

      notes: additional.notes,
      terms: additional.terms,

      services: services.map((service) => service.id),
      status,
      sendMail,
      payments,
      issueDate,
      tags,
    };

    // check if any service is empty
    if (services.length === 0) {
      alert("Please add a service to the invoice");
      return;
    }

    if (lastPath === "create") {
      setLoading(true);
      console.log("gonna create invoice");
      const res = await createInvoice(data);

      // @ts-ignore
      if (res && res.field) {
        // @ts-ignore
        showError(res);
        setLoading(false);
      } else {
        // NOTE: router.push takes time to redirect, so we will use window
        window.location.href = `/invoice/view/${data.invoiceId}`;
      }
    } else if (pathname.split("/")[2] === "edit") {
      setLoading(true);
      console.log("gonna update invoice");
      const res = await editInvoice(data);

      console.log("amount: ", payments[0].amount);

      // @ts-ignore
      if (res && res.field) {
        console.log("error", res);

        // @ts-ignore
        showError(res);
        setLoading(false);
      } else {
        window.location.href = `/invoice`;
      }
    } else if (lastPath === "estimate") {
      // TODO: For now, we will use the same function as create
      setLoading(true);
      const res = await createInvoice(data);

      // @ts-ignore
      if (res && res.field) {
        // @ts-ignore
        showError(res);
      } else {
        reset();
        router.push(`/invoice/view/${data.invoiceId}`);
      }
    } else {
      alert("Invalid path");
    }
  };

  return (
    <button
      type="submit"
      className="mx-auto mt-4 block rounded-md bg-blue-500 px-10 py-2 text-white max-[1635px]:px-5 max-[1635px]:py-1 max-[1200px]:px-3 max-[1200px]:py-1 max-[1200px]:text-xs"
      onClick={handleSubmit}
    >
      {loading ? (
        <ThreeDots color="#fff" height={20} width={40} />
      ) : lastPath === "create" ? (
        "Create Invoice"
      ) : (
        "Update Invoice"
      )}
    </button>
  );
}
