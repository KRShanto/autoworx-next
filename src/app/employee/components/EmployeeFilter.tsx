"use client";

import { IoSearchOutline } from "react-icons/io5";
import DateRange from "../../../components/DateRange";
import AddNewEmployee from "../../../components/Lists/NewEmployee";
import { useEmployeeFilterStore } from "@/stores/employeeFilter";

// filter component for /employee page
export default function EmployeeFilter() {
  const { setFilter } = useEmployeeFilterStore();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-8">
        <div className="flex w-[500px] items-center gap-x-2 rounded-md border border-gray-300 px-4 py-1 text-gray-400">
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
        <select
          className="app-shadow rounded-md bg-white p-2 text-[#797979]"
          onChange={(e) => setFilter({ type: e.target.value as any })}
        >
          {["All", "Sales", "Technician", "Manager", "Other"].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <AddNewEmployee />
    </div>
  );
}
