import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

export default function Selector({
  label,
  newButton,
  children,
}: {
  label: string;
  newButton: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-10 basis-full md:basis-96">
      {!open ? (
        <div className="flex h-full items-center justify-between rounded-md border-2 border-slate-400 px-4">
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between"
          >
            <p className="text-sm font-medium text-slate-400">{label}</p>
            <FaChevronDown className="text-[#797979]" />
          </button>
        </div>
      ) : (
        <div className="absolute z-50 w-full rounded-lg border-2 border-slate-400 bg-white">
          {/* Search */}
          <div className="relative m-2">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border-2 border-slate-400 p-1 pl-6 pr-10 focus:outline-none"
            />
            <button onClick={() => setOpen(false)}>
              <FaChevronUp className="absolute right-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
            </button>
          </div>

          <div className="mb-5" onClick={() => setOpen(false)}>
            {children}
          </div>

          {/* New button */}
          <div className="border-t-2 border-slate-400 p-2">{newButton}</div>
        </div>
      )}
    </div>
  );
}
