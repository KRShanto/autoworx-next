"use client";

import { SearchOutlined } from "@ant-design/icons";

import DateRange from "@/components/DateRange";
import { IoPieChartOutline } from "react-icons/io5";
import FilterforPayment from "./FilterforPayment";
import { useState } from "react";
import { usePaymentFilterStore } from "@/stores/paymentFilter";

export default function HeaderSearch() {
  const { setFilter } = usePaymentFilterStore();

  return (
    <div className="mt-5 flex w-full items-center justify-between">
      <div className="flex w-full max-w-4xl rounded-md border border-gray-300 bg-white p-2">
        <div className="flex w-full items-center gap-4">
          <div className="relative min-w-0 flex-1">
            <SearchOutlined className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-[#66738C] p-2 pl-10"
              onChange={(e) => setFilter({ search: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="z-50 m-2 px-4">
              <DateRange
                onOk={(start, end) => setFilter({ dateRange: [start, end] })}
                onCancel={() => setFilter({ dateRange: [null, null] })}
              />
            </div>
            <FilterforPayment />
          </div>
        </div>
      </div>

      <div className="mr-4 flex gap-4">
        <div>
          <button className="flex items-center gap-x-2 rounded border border-[#66738C] bg-white p-2 px-5 text-[#6571FF] shadow-md">
            <IoPieChartOutline />
            <span>Payment Reporting</span>
          </button>
        </div>
      </div>
    </div>
  );
}
