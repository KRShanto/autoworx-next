"use client";

import { cn } from "../../../../lib/cn";
import { useCalendarUserTypeStore } from "../../../../stores/calendarUserType";

export default function Heading() {
  const { calendarUserType, setCalendarUserType } = useCalendarUserTypeStore();

  return (
    <div className="calender-time-shadow flex h-[42px] w-[263px] items-center justify-center gap-2 rounded-[6px] bg-[#D9D9D9] max-[1300px]:w-[210px]">
      <button
        className={cn(
          "h-[34px] w-[110px] rounded-[4px] text-[19px] text-[#797979] max-[1300px]:h-[30px] max-[1300px]:w-[90px] max-[1300px]:text-[17px]",
          calendarUserType === "USERS" && "bg-white",
        )}
        onClick={() => setCalendarUserType("USERS")}
      >
        Users
      </button>
      <button
        className={cn(
          "h-[34px] w-[110px] rounded-[4px] text-[19px] text-[#797979] max-[1300px]:h-[30px] max-[1300px]:w-[90px] max-[1300px]:text-[17px]",
          calendarUserType === "TASKS" && "bg-white",
        )}
        onClick={() => setCalendarUserType("TASKS")}
      >
        Tasks
      </button>
    </div>
  );
}
