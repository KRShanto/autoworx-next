"use client";

import { cn } from "@/lib/cn";
import { usePopupStore } from "@/stores/popup";
import type { CalendarTask } from "@/types/db";
import type { User } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { HiCalendar, HiClock } from "react-icons/hi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { deleteTask } from "../../delete";

export function TaskDetails({
  task,
  companyUsers,
}: {
  task: CalendarTask;
  companyUsers: User[];
}) {
  const { open } = usePopupStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    setLoading(true);
    await deleteTask(id);
    setLoading(false);
  };

  return (
    <div
      className={cn(
        "w-[400px]",
      )}
    >
      <p className="text-[19px] font-bold text-slate-600">{task.title}</p>
      <hr />

      <div className="mt-2 flex items-center justify-between">
        <p className="flex items-center text-[17px] text-slate-600">
          <HiCalendar />
          {moment(task.date).format("MMM DD, YYYY")}
        </p>

        <p className="flex items-center text-[17px] text-slate-600">
          <HiClock />
          {moment(task.startTime, "HH:mm").format("hh:mm A")}
          <span className="mx-1">-</span>
          <HiClock />
          {moment(task.endTime, "HH:mm").format("hh:mm A")}
        </p>
      </div>

      {/* Options */}
      <div className="flex justify-end text-[14px]">
        <button
          type="button"
          className="mt-2 flex items-center rounded-md bg-[#24a0ff] px-2 py-1 text-white"
          onClick={() => {
            open("EDIT_TASK", { ...task, companyUsers });
          }}
        >
          <MdModeEdit />
          Edit
        </button>
        <button
          type="button"
          className="ml-2 mt-2 flex items-center rounded-md bg-[#ff4d4f] px-2 py-1 text-white"
          onClick={() => handleDelete(task.id)}
        >
          {loading ? (
            <ThreeDots color="#fff" height={10} width={30} />
          ) : (
            <>
              <MdDelete />
              Delete
            </>
          )}
        </button>
      </div>

      {/* Show users */}
      <div className="mt-3 h-[10rem] overflow-auto">
        {task.assignedUsers.map((user) => {
          return (
            <div
              className="mt-2 flex items-center bg-[#F8F9FA] px-1 py-3"
              key={user.id}
            >
              <Image
                src={user.image}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="ml-2 text-[18px] font-bold text-slate-600">
                {user.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
