"use client";

import { DropdownSelection } from "@/components/DropDownSelection";
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
      <DropdownSelection
        dropDownValues={[
          "All Categories",
          ...Array.from(new Set(categories.map((cate) => cate.name))),
        ]}
        onValueChange={(value) =>
          setFilter({
            category: value === "All Categories" ? "" : value,
          })
        }
        changesValue={category || "All Categories"}
        buttonClassName="md:w-60 shadow-md"
      />
      
    </div>
  );
}
