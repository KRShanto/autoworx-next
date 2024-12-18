"use client";

import { DropdownSelection } from "@/components/DropDownSelection";
import { useEmployeeFilterStore } from "@/stores/employeeFilter";
import { IoSearchOutline } from "react-icons/io5";
import DateRange from "../../../components/DateRange";
import AddNewEmployee from "../../../components/Lists/NewEmployee";

// filter component for /employee page
export default function EmployeeFilter() {
  const { setFilter, type } = useEmployeeFilterStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-x-2 rounded-md border border-gray-300 px-4 py-1 text-gray-400 lg:w-[500px]">
          <span>
            <IoSearchOutline />
          </span>
          <input
            name="search"
            type="text"
            className="w-full rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search"
            onChange={(e) => setFilter({ search: e.currentTarget.value })}
          />
        </div>
        <DateRange
          onOk={(start, end) => setFilter({ dateRange: [start, end] })}
          onCancel={() => setFilter({ dateRange: [null, null] })}
        />
        <DropdownSelection
          dropDownValues={["All", "Sales", "Technician", "Manager", "Other"]}
          onValueChange={(value) => setFilter({ type: value as any })}
          changesValue={type}
          buttonClassName="min-w-[100px] shadow-md"
        />
      </div>
      <AddNewEmployee />
    </div>
  );
}
