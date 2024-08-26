"use client";

import DateRange from "../../../components/DateRange";
import { useEmployeeWorkFilterStore } from "@/stores/employeeWorkFilter";
import Search from "@/app/employee/components/Search";
import Dropdown from "./Dropdown";


export default function FilterComp() {
  const { setFilter } = useEmployeeWorkFilterStore();

  return (
    <div className="mt-5 flex w-full items-center justify-between">
      <div className="flex w-full max-w-4xl rounded-lg border border-gray-300 bg-white p-2">
        <div className="flex w-full items-center gap-4">
          <Search />
          <div className="flex items-center gap-4">
            <div className="m-2 px-4">
              <DateRange
                onOk={(start, end) => setFilter({ dateRange: [start, end] })}
                onCancel={() => setFilter({ dateRange: [null, null] })}
              />
            </div>
            <div className="relative">
              <Dropdown />
            </div>
          </div>
        </div>
      </div>

  
    </div>
  );
}
