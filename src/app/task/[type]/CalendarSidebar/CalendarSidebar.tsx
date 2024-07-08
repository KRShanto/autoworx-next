"use client";

import Heading from "./Heading";
import Body from "./Body";
import type { Appointment, Task } from "@prisma/client";
import { cn } from "@/lib/cn";
import { useCalendarSidebarStore } from "@/stores/calendarSidebar";

export default function CalendarSidebar({
  usersWithTasks,
  tasks,
}: {
  usersWithTasks: any;
  tasks: Task[];
}) {
  const minimized = useCalendarSidebarStore((x) => x.minimized);

  return (
    <div
      className={cn(
        "flex flex-col overflow-x-clip transition-[width] ease-in",
        minimized ? "w-8" : "w-[15%] max-[1300px]:w-[210px] 2xl:w-[263px]",
      )}
    >
      <Heading />
      <Body usersWithTasks={usersWithTasks} tasks={tasks} />
    </div>
  );
}
