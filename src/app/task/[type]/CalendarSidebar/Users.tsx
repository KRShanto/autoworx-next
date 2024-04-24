"use client";

import { useState } from "react";
import UserComponent from "./User";
import { usePopupStore } from "../../../../stores/popup";
import { Task, User } from "@prisma/client";

export default function Users({
  users,
  tasks,
}: {
  users: (User & { tasks: Task[] })[];
  tasks: Task[];
}) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { open } = usePopupStore();

  return (
    <div className="app-shadow mt-5 h-[93%] rounded-[12px] bg-white p-3">
      <div className="h-[10%]">
        <h2 className="text-[16px] text-[#797979]">User List</h2>

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
      </div>

      <div className="h-[82%] overflow-scroll py-2">
        {users.map((user, index) => {
          const isSelected = selectedUser === index;

          function handleClick() {
            if (isSelected) {
              setSelectedUser(null);
            } else {
              setSelectedUser(index);
            }
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

      <button
        className="mt-4 h-[5%] w-full rounded-[5px] bg-blue-600 py-2 text-[15px] text-white"
        onClick={() => open("ADD_USER")}
      >
        Add User
      </button>
    </div>
  );
}
