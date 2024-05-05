"use client";

import { cn } from "../../../../lib/cn";
import { useCalendarSidebarStore } from "../../../../stores/calendarSidebar";

export default function Heading() {
  const { type, minimized, setType } = useCalendarSidebarStore();

  return (
    <div className="calender-time-shadow flex min-h-8 items-center justify-center gap-2 rounded-[6px] bg-[#D9D9D9] p-0.5">
      {!minimized && (
        <>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-[4px] text-[19px] text-[#797979] max-[1300px]:h-[30px] max-[1300px]:w-[90px] max-[1300px]:text-[17px]",
              type === "USERS" && "bg-white",
            )}
            onClick={() => setType("USERS")}
          >
            Users
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-[4px] text-[19px] text-[#797979] max-[1300px]:h-[30px] max-[1300px]:w-[90px] max-[1300px]:text-[17px]",
              type === "TASKS" && "bg-white",
            )}
            onClick={() => setType("TASKS")}
          >
            Tasks
          </button>
        </>
      )}
    </div>
  );
}
