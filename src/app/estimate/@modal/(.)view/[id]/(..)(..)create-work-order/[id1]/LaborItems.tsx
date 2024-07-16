import React from "react";
import { TiDeleteOutline } from "react-icons/ti";
import Link from "next/link";
export default function LaborItems({ labor }: { labor: any }) {
  return (
    <div className="mx-10 h-32 overflow-y-auto rounded-md border border-solid border-[#6571FF] p-2">
      <p className="py-1 capitalize">{labor?.name}</p>
      <div className="grid grid-cols-4 gap-2">
        <Link
          href="/estimate/labor/create"
          className="rounded-full border border-[#6571FF] px-3 py-0.5"
        >
          + Add Labor
        </Link>
        <button className="flex items-center justify-center space-x-1 rounded-full border bg-[#6571FF] px-3 py-0.5">
          <Link href={`/estimate/labor/edit/1`} className="text-white">
            labor name
          </Link>
          <TiDeleteOutline className="text-xl text-white" />
        </button>
      </div>
    </div>
  );
}
