"use client";

import DateRange from "../../../components/DateRange";
import { useEmployeeWorkFilterStore } from "@/stores/employeeWorkFilter";
import Dropdown from "./Dropdown";
import SearchTerms from "./SearchTerms";
interface Props {
  pipelineType: string;
}

export default function FilterComp({pipelineType}: Props) {
  const { setFilter } = useEmployeeWorkFilterStore();

  return (
    <div className="mt-5 flex w-full items-center justify-between">
      <div className="flex w-full max-w-4xl rounded-lg border border-gray-300 bg-white p-2">
        <div className="flex w-full items-center gap-4">
          <SearchTerms />
          <div className="flex items-center gap-4">
            <div className="m-2 px-4">
              <DateRange
                onOk={(start, end) => setFilter({ dateRange: [start, end] })}
                onCancel={() => setFilter({ dateRange: [null, null] })}
              />
            </div>
            <div className="relative">
              <Dropdown pipelineType={pipelineType} />
            </div>
          </div>
        </div>
      </div>

  
    </div>
  );
}
