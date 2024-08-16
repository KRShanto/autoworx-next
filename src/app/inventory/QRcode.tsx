"use client";

import React from "react";
import { FaPrint } from "react-icons/fa";

export default function QRcode({ imgUrl }: { imgUrl: string }) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            img { width: 500px; height: 500px; }
          </style>
        </head>
        <body>
          <img src="${imgUrl}" alt="qr code" />
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <button
      className="mx-auto mt-3 flex w-fit items-center gap-1 rounded-md border border-slate-400 p-1 px-3"
      onClick={handlePrint}
    >
      <FaPrint className="text-sm" />
      Print
    </button>
  );
}
