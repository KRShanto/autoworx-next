"use client";

import { useState } from "react";
import UserComponent from "./User";
import { Task, User } from "@prisma/client";
import { MinimizeButton } from "./MinimiseButton";
import { useCalendarSidebarStore } from "@/stores/calendarSidebar";
import { cn } from "@/lib/cn";
import NewEmployee from "@/components/Lists/NewEmployee";

export default function Users({
  users,
  tasks,
}: {
  users: (User & { tasks: Task[] })[];
  tasks: Task[];
}) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const minimized = useCalendarSidebarStore((x) => x.minimized);
  const setMinimized = useCalendarSidebarStore((x) => x.setMinimized);
  const [usersToDisplay, setUsersToDisplay] = useState(users);

  function searchUser(formData: FormData) {
    const searchValue = formData.get("search") as string;
    const filteredUsers = users.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchValue.toLowerCase()),
    );
    setUsersToDisplay(filteredUsers);
  }

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
          <form
            className="mt-3 flex items-center justify-center gap-2"
            action={searchUser}
          >
            <input
              type="search"
              className="w-[70%] rounded-[5px] border-none bg-[#F5F5F5] p-2 text-[13px] outline-none"
              placeholder="Search here..."
              name="search"
            />
            <button className="w-[30%] rounded-[5px] bg-[#797979] p-2 text-[13px] text-white">
              Search
            </button>
          </form>
        )}
      </div>

      <div className="flex-grow overflow-scroll py-2">
        {!minimized &&
          usersToDisplay.map((user, index) => {
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
                setUsers={setUsersToDisplay}
              />
            );
          })}
      </div>

      <NewEmployee
        button={
          <button className="mt-4 w-full rounded-[5px] bg-blue-600 py-2 text-[15px] text-white">
            + Add User
          </button>
        }
        onSuccess={(newUser) => {
          if (newUser) {
            setUsersToDisplay([
              ...usersToDisplay,
              {
                ...newUser,
                tasks: [],
              },
            ]);
          }
        }}
      />
    </div>
  );
}
