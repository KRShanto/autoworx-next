"use client";

import { Invoice } from "@prisma/client";
import React from "react";
import { SiConvertio } from "react-icons/si";
import { useRouter } from "next/navigation";
import { convertInvoice } from "../../actions/estimate/invoice/convert";

export default function ConvertTo({ id }: { id: string }) {
  async function convert() {
    const res = await convertInvoice(id);

    // TODO: remove this
    if (res.type === "success") {
      // reload the page
      window.location.reload();
    }
  }

  return (
    <button
      className="flex items-center gap-x-2 md:inline-block"
      onClick={convert}
      type="button"
    >
      <span className="md:hidden">Convert</span>
      <SiConvertio />
    </button>
  );
}
