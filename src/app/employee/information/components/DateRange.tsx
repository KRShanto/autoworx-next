'use client';
import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { CiCalendar } from "react-icons/ci";






const DateRange = () => {
  const [state, setState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  });

  const [showPicker, setShowPicker] = useState(false);
  const [tempRange, setTempRange] = useState(state.selection);

  const handleSelect = (ranges:any) => {
    setTempRange(ranges.selection);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleOk = () => {
    setState({ selection: tempRange });
    setShowPicker(false);
  };

  return (
    <div >
      

      <button onClick={togglePicker} className="flex items-center gap-2 rounded-lg border border-gray-400 p-2 w-full text-gray-400 text-sm hover:border-blue-600 ">
        <span>Date Range</span>
        <CiCalendar/>
      </button>
      
      {showPicker && (
        <div className="absolute z-10 bg-white border border-gray-300 p-4 shadow-lg">
          <DateRangePicker
            ranges={[tempRange]}
            onChange={handleSelect}
            // showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            preventSnapRefocus={true}
            calendarFocus="forwards"
          />
          <div className="flex justify-end mt-2">
            <button onClick={handleOk} className="mr-2 bg-blue-500 text-white p-2 rounded">OK</button>
            <button onClick={togglePicker} className="bg-gray-300 p-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRange;
