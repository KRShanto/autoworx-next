"use client";

import { cn } from "../../../../lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "../../../../stores/popup";
import { Task, User } from "@prisma/client";
import Image from "next/image";
import { useCalendarSidebarStore } from "@/stores/calendarSidebar";

export default function UserComponent({
  isSelected,
  handleClick,
  user,
  users,
  index,
  tasks,
}: {
  isSelected: boolean;
  handleClick: () => void;
  user: User & { tasks: Task[] };
  users: User[];
  index: number;
  tasks: Task[];
}) {
  const { open } = usePopupStore();
  const minimized = useCalendarSidebarStore((x) => x.minimized);

  return (
    <>
      <button
        className={cn(
          "mt-2 flex w-full items-center rounded-lg py-2 sm:h-[12%]",
          isSelected ? "bg-[#006D77]" : "bg-[#F8F9FA]",
        )}
        onClick={handleClick}
        key={index}
      >
        <Image
          src={`/api/images/${user.image}`}
          alt="User Image"
          width={50}
          height={50}
          className="rounded-full sm:max-h-12 sm:max-w-12"
        />
        <p
          className={cn(
            "ml-2 text-[14px] font-bold sm:text-xs",
            isSelected ? "text-white" : "text-[#797979]",
            minimized && "sr-only",
          )}
        >
          {user.firstName} {user.lastName}
        </p>
      </button>

      {isSelected && !minimized && (
        <div className="my-3">
          {user.tasks.map((task, index) => (
            <div className="ml-4 mt-2 flex items-center gap-2" key={index}>
              <div
                className="h-[10px] w-[10px] rounded-full"
                style={{ backgroundColor: TASK_COLOR[task.priority] }}
              ></div>
              <p className="text-[16px]">{task.title}</p>
            </div>
          ))}

          <button
            className="mt-3 rounded-2xl bg-slate-500 px-5 py-1 text-[15px] text-white sm:text-xs"
            onClick={() =>
              open("ASSIGN_TASK", {
                user,
                users,
                tasks,
              })
            }
          >
            + Assign Task
          </button>
        </div>
      )}
    </>
  );
}
