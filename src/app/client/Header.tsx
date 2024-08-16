"use client";

import NewCustomer from "@/components/Lists/NewCustomer";
import { useClientFilterStore } from "@/stores/clientFilter";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";

export default function Header() {
  const { setFilter } = useClientFilterStore();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-8 bg-white">
        <div className="flex w-[500px] items-center gap-x-2 rounded-md border border-gray-300 px-4 py-1 text-gray-400">
          <span className="">
            <IoSearchOutline />
          </span>
          <input
            name="search"
            type="text"
            className="w-full rounded-md border border-slate-400 px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search"
            onChange={(e) => setFilter({ search: e.target.value })}
          />
        </div>
      </div>
      <NewCustomer
        buttonElement={
          <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
            + Add New Client
          </button>
        }
      />
    </div>
  );
}
