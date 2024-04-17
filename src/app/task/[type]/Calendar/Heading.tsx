import Link from "next/link";
import { cn } from "../../../../lib/cn";
import moment from "moment";
import { CalendarType } from "@/types/calendar";

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

      {/* Calender type selector */}
      <div className="calender-time-shadow flex h-[42px] w-[263px] items-center justify-center gap-2 rounded-[6px] bg-[#D9D9D9] max-[1300px]:w-[210px]">
        <Link
          className={cn(
            "h-[34px] w-[78px] rounded-[4px] text-center text-[19px] text-[#797979] max-[1300px]:h-[30px] max-[1300px]:w-[60px] max-[1300px]:text-[17px]",
            type === "day" && "bg-white",
          )}
          href="/task/day"
        >
          Day
        </Link>
        <Link
          className={cn(
            "h-[34px] w-[78px] rounded-[4px] text-center text-[19px] text-[#797979] max-[1300px]:h-[30px] max-[1300px]:w-[60px] max-[1300px]:text-[17px]",
            type === "week" && "bg-white",
          )}
          href="/task/week"
        >
          Week
        </Link>
        <Link
          className={cn(
            "h-[34px] w-[78px] rounded-[4px] text-center text-[19px] text-[#797979] max-[1300px]:h-[30px] max-[1300px]:w-[60px] max-[1300px]:text-[17px]",
            type === "month" && "bg-white",
          )}
          href="/task/month"
        >
          Month
        </Link>
      </div>
    </div>
  );
}
