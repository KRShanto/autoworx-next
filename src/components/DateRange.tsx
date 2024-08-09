"use client";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { CiCalendar } from "react-icons/ci";

const DateRange = ({
  onOk,
  onCancel,
}: {
  onOk: (start: Date, end: Date) => void;
  onCancel: () => void;
}) => {
  const [state, setState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  });
  const ref = useRef<HTMLDivElement>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [tempRange, setTempRange] = useState(state.selection);
  const [isRangeSelected, setIsRangeSelected] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (ranges: any) => {
    setTempRange(ranges.selection);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleOk = () => {
    setState({ selection: tempRange });
    setShowPicker(false);
    setIsRangeSelected(true);
    onOk(tempRange.startDate, tempRange.endDate);
  };

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowPicker(false);
    }
  };

  const handleCancel = () => {
    togglePicker();
    // reset everything
    setState({
      selection: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    });
    setIsRangeSelected(false);
    setTempRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });
    onCancel();
  };

  const formatRange = (start: Date, end: Date) => {
    const formattedStart = format(start, "MM/dd/yyyy");
    const formattedEnd = format(end, "MM/dd/yyyy");
    return `${formattedStart} - ${formattedEnd}`;
  };

  return (
    <div ref={ref}>
      <button
        onClick={togglePicker}
        className="flex w-full items-center gap-2 rounded-lg border border-gray-400 p-2 text-sm text-gray-400 hover:border-blue-600"
      >
        <span>
          {isRangeSelected
            ? formatRange(state.selection.startDate, state.selection.endDate)
            : "Date Range"}
        </span>
        <CiCalendar />
      </button>

      {showPicker && (
        <div className="absolute z-10 w-[600px] border border-gray-300 bg-white p-4 shadow-lg">
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
            <button onClick={handleCancel} className="rounded bg-gray-300 p-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRange;
