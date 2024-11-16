/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

export default function QRcode({ imgUrl }: { imgUrl: string }) {
  const contentRef = useRef<HTMLImageElement>(null);
  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
  });

  return (
    <div>
      <div className="hidden">
        <img
          ref={contentRef}
          src={imgUrl}
          alt="qr code"
          className="mx-auto my-auto aspect-square w-[500px]"
        />
      </div>
      <button
        className="mx-auto mt-3 flex w-fit items-center gap-1 rounded-md border border-slate-400 p-1 px-3"
        onClick={reactToPrintFn}
      >
        <FaPrint className="text-sm" />
        Print
      </button>
    </div>
  );
}
