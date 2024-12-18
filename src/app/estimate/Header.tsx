"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";
import { Filter } from "./Filter";
import Link from "next/link";
import { useEstimateFilterStore } from "@/stores/estimate-filter";
import { usePathname } from "next/navigation";
import { useActionStoreCreateEdit } from "@/stores/createEditStore";

export default function Header() {
  const { setFilter } = useEstimateFilterStore();
  const { setActionType } = useActionStoreCreateEdit();
  const pathname = usePathname();

  const shouldShowCreateEstimate = pathname != "/estimate/canned";
  return (
    <div className="mt-5 flex flex-col-reverse justify-between md:flex-row">
      <div className="app-shadow gap-3 rounded-md p-3 md:flex">
        {/* Search */}
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="h-10 w-full rounded-md border-2 border-slate-400 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-600 md:w-64"
            onChange={(e) => setFilter({ search: e.target.value })}
          />
        </div>

        <Filter />
      </div>

      {/* Create Estimate */}
      {shouldShowCreateEstimate && (
        <Link
          href="/estimate/create"
          className="app-shadow mx-auto flex h-10 w-full max-w-[300px] items-center justify-center rounded-md bg-[#6571FF] px-5 text-white md:mx-0 md:max-w-max"
          onClick={() => setActionType("create")}
        >
          + Create Estimate
        </Link>
      )}
    </div>
  );
}
