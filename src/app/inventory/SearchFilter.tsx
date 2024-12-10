"use client";

import { useInventoryFilterStore } from "@/stores/inventoryFilter";
import { useListsStore } from "@/stores/lists";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchFilter() {
  const searchParams = useSearchParams();
  const { search, category, setFilter } = useInventoryFilterStore();
  const { categories } = useListsStore();

  // reset the filter when the search changes
  useEffect(() => setFilter({ search: "", category: "" }), [searchParams]);

  return (
    <div className="flex w-full items-center justify-between gap-5">
      <div className="relative w-full">
        <FaSearch className="absolute top-[5px] ml-2 text-lg text-slate-400 md:top-[9px]" />
        <input
          type="text"
          className="w-[70%] rounded-md border-2 border-slate-400 p-1 px-3 pl-8"
          placeholder="Search..."
          value={search}
          onChange={(e) => setFilter({ search: e.target.value })}
        />
      </div>
      <select
        className="w-[30%] flex-shrink-0 rounded-md border-2 border-slate-400 bg-white p-1 px-3 md:text-lg"
        value={category}
        onChange={(e) =>
          setFilter({
            category: e.target.value === "All Categories" ? "" : e.target.value,
          })
        }
      >
        {[{ name: "All Categories" }, ...categories].map((category, index) => (
          <option
            key={index}
            value={category.name}
            className="text-sm md:text-base"
          >
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
