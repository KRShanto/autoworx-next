"use client";

import { SearchOutlined } from "@ant-design/icons";

import DateRange from "./DateRange";


export default function FilterComp() {
  return (
    <div className="mt-5 flex w-full items-center justify-between">
      <div className="flex w-full max-w-4xl rounded-lg border border-gray-300 bg-white p-2">
        <div className="flex w-full items-center gap-4">
          <div className="relative min-w-0 flex-1">
            <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-gray-300 p-2 pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="m-2 px-4">
              <DateRange />
            </div>
            <div className="relative">
              <select className="rounded border border-gray-300 p-2">
                <option value="">Filter</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mr-4 flex gap-4">
        <div className="relative">
          <select className="rounded border border-gray-300 p-2">
            <option value="">Category</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
        <div className="relative">
          <select className="rounded border border-gray-300 p-2">
            <option value="">Service</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
      </div>
    </div>
  );
}
