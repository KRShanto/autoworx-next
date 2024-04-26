import Link from "next/link";
import { cn } from "../../../../lib/cn";
import moment from "moment";
import { CalendarType } from "@/types/calendar";
import { GoGear } from "react-icons/go";
import {
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosArrowBack,
  IoIosArrowUp,
} from "react-icons/io";

export default function Heading({ type }: { type: CalendarType }) {
  return (
    <div className="flex items-center justify-between">
      {/* Month name */}
      <h2 className="ml-2 text-[26px] font-bold text-[#797979] max-[1300px]:text-[20px]">
        {/* If day is selected, then : Day, Month year */}
        {/* else: Month year */}
        {type === "day"
          ? moment().format("dddd, MMMM YYYY")
          : moment().format("MMMM YYYY")}
      </h2>

      {/* Calender options */}
      <div className="flex items-center gap-3 ">
        {/* Day selector */}
        <button className="app-shadow rounded-md p-2 text-[#797979]">
          Today
        </button>

        {/* Left Arrow */}
        <button className="app-shadow rounded-md p-2 text-[#797979]">
          <IoIosArrowBack />
        </button>

        {/* Right Arrow */}
        <button className="app-shadow rounded-md p-2 text-[#797979]">
          <IoIosArrowForward />
        </button>

        {/* Month selector */}
        <button className="app-shadow flex items-center gap-1 rounded-md p-2 text-[#797979]">
          Month <IoIosArrowDown />
        </button>

        {/* New Appointment button */}
        <button className="app-shadow rounded-md bg-[#6571FF] p-2 text-white">
          New Appointment
        </button>

        {/* Settings */}
        <button className="app-shadow rounded-md p-2 text-xl text-[#797979]">
          <GoGear />
        </button>
      </div>
    </div>
  );
}
