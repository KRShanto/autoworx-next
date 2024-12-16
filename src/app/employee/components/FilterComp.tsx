"use client";

import { DropdownSelection } from "@/components/DropDownSelection";
import DateRange from "../../../components/DateRange";
import Filter from "./Filter";
import Search from "./Search";
import { useEmployeeWorkFilterStore } from "@/stores/employeeWorkFilter";

type TProps = {
  service: string[];
  category: string[];
};

export default function FilterComp({ service, category }: TProps) {
  const {
    setFilter,
    category: selectedCategory,
    service: selectedService,
  } = useEmployeeWorkFilterStore();

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
              <Filter />
            </div>
          </div>
        </div>
      </div>

      <div className="mr-4 flex gap-10">
        <div className="relative">
          <DropdownSelection
            dropDownValues={category}
            onValueChange={(value) => setFilter({ category: value })}
            changesValue={selectedCategory}
            defaultValue="Category"
          />
        </div>
        <div className="relative">
          <DropdownSelection
            dropDownValues={service}
            onValueChange={(value) => setFilter({ service: value })}
            changesValue={selectedService}
            defaultValue="Service"
          />
        </div>
      </div>
    </div>
  );
}
