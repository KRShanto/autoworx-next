"use client";
import { format } from "date-fns";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { CiCalendar } from "react-icons/ci";
import { TFilterModalState } from "../../(report)/revenue/FilterHeader";
type TProps = {
  startDate: string;
  endDate: string;
  modalName: string;
  closeModal: (modalName: string) => void;
  toggleModal: (modalName: string) => void;
  activeModal: TFilterModalState;
};
export default function FilterDateRange({
  startDate,
  endDate,
  closeModal,
  toggleModal,
  activeModal,
  modalName,
}: TProps) {
  const [state, setState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // const [showPicker, setShowPicker] = useState(false);
  const [tempRange, setTempRange] = useState(state.selection);
  const [isRangeSelected, setIsRangeSelected] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeModal(modalName);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const handleSelect = (ranges: any) => {
    setTempRange(ranges.selection);
  };

  const togglePicker = () => {
    toggleModal(modalName);
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
    closeModal(modalName);
    setIsRangeSelected(true);
  };

  const formatRange = (start: Date, end: Date) => {
    const formattedStart = format(start, "MM/dd/yyyy");
    const formattedEnd = format(end, "MM/dd/yyyy");
    if (startDate !== "undefined" && endDate !== "undefined") {
      return `${startDate} - ${endDate}`;
    } else if (isRangeSelected) {
      return `${formattedStart} - ${formattedEnd}`;
    } else {
      return "Date Range";
    }
  };

  const handleClear = () => {
    const searchParams = new URLSearchParams(params);
    searchParams.delete("startDate");
    searchParams.delete("endDate");
    const newPath = `${pathname}?${searchParams.toString()}`;
    router.replace(newPath);
    setState({
      selection: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    });
    closeModal(modalName);
    setIsRangeSelected(false);
  };
  return (
    <div>
      <button
        ref={buttonRef}
        onClick={togglePicker}
        className="flex max-w-80 items-center gap-2 rounded-sm border border-gray-400 p-1 text-sm text-gray-400 hover:border-blue-600"
      >
        <span>
          {formatRange(state.selection.startDate, state.selection.endDate)}
        </span>
        <CiCalendar />
      </button>

      {activeModal[modalName as keyof TFilterModalState] && (
        <div
          ref={dropdownRef}
          className="absolute z-10 border border-gray-300 bg-white p-4 shadow-lg hover:z-20"
        >
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
              onClick={handleClear}
              className="mr-2 rounded bg-red-500 p-2 text-white"
            >
              Clear
            </button>
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
