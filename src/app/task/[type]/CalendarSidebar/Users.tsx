"use client";

import { useState } from "react";
import UserComponent from "./User";
import { usePopupStore } from "../../../../stores/popup";
import { Task, User } from "@prisma/client";
import { MinimizeButton } from "./MinimiseButton";
import { useCalendarSidebarStore } from "@/stores/calendarSidebar";
import { FaPlus } from "react-icons/fa";
import { cn } from "@/lib/cn";

export default function Users({
  users,
  tasks,
}: {
  users: (User & { tasks: Task[] })[];
  tasks: Task[];
}) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { open } = usePopupStore();
  const minimized = useCalendarSidebarStore((x) => x.minimized);
  const setMinimized = useCalendarSidebarStore((x) => x.setMinimized);

  return (
    <div
      className={cn(
        "app-shadow mt-5 flex flex-grow flex-col rounded-[12px] bg-white",
        minimized || "p-3",
      )}
    >
      <div>
        <h2 className="flex items-center justify-between">
          {!minimized && (
            <div className="text-[16px] text-[#797979]">User List</div>
          )}
          <MinimizeButton />
        </h2>

        {!minimized && (
          <form className="mt-3 flex items-center justify-center gap-2">
            <input
              type="search"
              className="w-[70%] border-none"
              placeholder="Search here..."
            />
            <button className="w-[30%] rounded-[5px] bg-[#797979] p-2 text-[13px] text-white">
              Filter
            </button>
          </form>
        )}
      </div>

      <div className="flex-grow overflow-scroll py-2">
        {!minimized &&
          users.map((user, index) => {
            const isSelected = selectedUser === index;

            function handleClick() {
              if (isSelected) {
                setSelectedUser(null);
              } else {
                setSelectedUser(index);
              }
              setMinimized(false);
            }

            return (
              <UserComponent
                key={index}
                isSelected={isSelected}
                handleClick={handleClick}
                user={user}
                users={users}
                index={index}
                tasks={tasks}
              />
            );
          })}
      </div>

      {!minimized && (
        <button
          type="button"
          className="mt-4 w-full rounded-[5px] bg-blue-600 py-2 text-[15px] text-white"
          onClick={() => open("ADD_USER")}
        >
          Add User
        </button>
      )}
    </div>
  );
}
