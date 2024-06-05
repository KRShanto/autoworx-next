import React, { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { DropdownMenu, DropdownMenuTrigger } from "./DropdownMenu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/cn";

export default function Selector({
  label,
  newButton,
  children,
  openState,
  setSearch,
}: {
  label: string;
  newButton: React.ReactNode;
  children: React.ReactNode;
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = openState || useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div className="basis-full md:basis-96">
        <DropdownMenuTrigger
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border-2 border-slate-400 px-4",
            open && "invisible",
          )}
        >
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <FaChevronDown className="text-[#797979]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={-40}
          className="z-50 w-full rounded-lg border-2 border-slate-400 bg-white"
          style={{ minWidth: "var(--radix-popper-anchor-width)" }}
        >
          {/* Search */}
          <div className="relative m-2">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border-2 border-slate-400 p-1 pl-6 pr-10 focus:outline-none"
              onChange={(e) => setSearch?.(e.target.value)}
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
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
