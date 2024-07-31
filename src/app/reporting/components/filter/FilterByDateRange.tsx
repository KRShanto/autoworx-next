"use client";
import { format } from "date-fns";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { CiCalendar } from "react-icons/ci";
type TProps = {
  startDate: string;
  endDate: string;
};
export default function FilterDateRange({ startDate, endDate }: TProps) {
  const [state, setState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  });

  const [showPicker, setShowPicker] = useState(false);
  const [tempRange, setTempRange] = useState(state.selection);
  const [isRangeSelected, setIsRangeSelected] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const handleSelect = (ranges: any) => {
    setTempRange(ranges.selection);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleOk = () => {
    const searchParams = new URLSearchParams(params);
    const formattedStart = format(tempRange.startDate, "MM/dd/yyyy");
    const formattedEnd = format(tempRange.endDate, "MM/dd/yyyy");
    if (tempRange.startDate && tempRange.endDate) {
      searchParams.set("startDate", encodeURIComponent(formattedStart));
      searchParams.set("endDate", encodeURIComponent(formattedEnd));
    } else {
      searchParams.delete("startDate");
      searchParams.delete("endDate");
    }
    const newPath = `${pathname}?${searchParams.toString()}`;
    router.push(newPath);
    setState({ selection: tempRange });
    setShowPicker(false);
    setIsRangeSelected(true);
  };

  const formatRange = (start: Date, end: Date) => {
    const formattedStart = format(start, "MM/dd/yyyy");
    const formattedEnd = format(end, "MM/dd/yyyy");
    if (startDate !== "undefined" && endDate !== "undefined") {
      return `${startDate} - ${endDate}`;
    } else if (isRangeSelected) {
      console.log("formattedDate ", true);
      return `${formattedStart} - ${formattedEnd}`;
    } else {
      return "Date Range";
    }
  };
  return (
    <div>
      <button
        onClick={togglePicker}
        className="flex max-w-80 items-center gap-2 rounded-lg border border-gray-400 p-1 text-sm text-gray-400 hover:border-blue-600"
      >
        <span>
          {formatRange(state.selection.startDate, state.selection.endDate)}
        </span>
        <CiCalendar />
      </button>

      {showPicker && (
        <div className="absolute z-10 border border-gray-300 bg-white p-4 shadow-lg">
          <DateRangePicker
            ranges={[tempRange]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            preventSnapRefocus={true}
            calendarFocus="forwards"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleOk}
              className="mr-2 rounded bg-blue-500 p-2 text-white"
            >
              OK
            </button>
            <button onClick={togglePicker} className="rounded bg-gray-300 p-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
