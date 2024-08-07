"use client";

import { SearchOutlined } from "@ant-design/icons";

import DateRange from "@/app/employee/information/components/DateRange";
import { IoPieChartOutline } from "react-icons/io5";
import FilterforPayment from "./FilterforPayment";
import { useState } from "react";

export default function HeaderSearch() {
  const [showFilter, setShowFilter] = useState(false);


  const handleFilterApply = () => {
    setShowFilter(false); // Close the filter dropdown
  };
  return (
    <div className="mt-5 flex w-full items-center justify-between">
      <div className="flex w-full max-w-4xl rounded-md border border-gray-300 bg-white p-2">
        <div className="flex w-full items-center gap-4">
          <div className="relative min-w-0 flex-1">
            <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-[#66738C]  p-2 pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="m-2 px-4 z-50">
              <DateRange />
            </div>
            <div className="relative ">
              <button
                className="flex rounded border border-[#66738C] p-2 text-gray-400 w-[100px] h-[40px] items-center justify-center"
                onClick={() => setShowFilter((prev)=> !prev)}
              >Filter 
              </button>
              {showFilter &&
                    <div className="absolute z-40"> 
                <FilterforPayment onApply={handleFilterApply}/>

                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="mr-4 flex gap-4">
      <div>
          <button className="flex items-center gap-x-2 border border-[#66738C] rounded bg-white p-2 px-5 text-[#6571FF] shadow-md ">
            <IoPieChartOutline />
            <span>Payment Reporting</span>
          </button>
        </div>
      </div>
    </div>
  );
}
