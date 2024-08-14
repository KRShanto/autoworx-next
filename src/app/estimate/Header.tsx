"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";
import { Filter } from "./Filter";
import Link from "next/link";
import { useEstimateFilterStore } from "@/stores/estimate-filter";

export default function Header() {
  const { setFilter } = useEstimateFilterStore();

  return (
    <div className="mt-5 flex justify-between">
      <div className="app-shadow flex gap-3 rounded-md p-3">
        {/* Search */}
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="h-10 w-64 rounded-md border-2 border-slate-400 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setFilter({ search: e.target.value })}
          />
        </div>

        <Filter />
      </div>

      {/* Create Estimate */}
      <Link
        href="/estimate/create"
        className="app-shadow flex h-10 items-center rounded-md bg-[#6571FF] px-5 text-white"
      >
        + Create Estimate
      </Link>
    </div>
  );
}
