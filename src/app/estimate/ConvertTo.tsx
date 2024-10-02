"use client";

import { Invoice } from "@prisma/client";
import React from "react";
import { SiConvertio } from "react-icons/si";
import { useRouter } from "next/navigation";
import { convertInvoice } from "../../actions/estimate/invoice/convert";

export default function ConvertTo({ id }: { id: string }) {
  const router = useRouter();

  async function convert() {
    const res = await convertInvoice(id);

    // TODO: remove this
    if (res.type === "success") {
      // reload the page
      window.location.reload();
    }
  }

  return (
    <button onClick={convert} type="button">
      <SiConvertio />
    </button>
  );
}
