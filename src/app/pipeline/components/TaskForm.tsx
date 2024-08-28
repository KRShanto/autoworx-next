"use client";

import { Priority, User } from "@prisma/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/Dialog";
import { FaCheck, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { TimePicker } from "antd";
import Avatar from "@/components/Avatar";

export default function TaskForm({
  companyUsers,
  onlyOneUser = false,
}: {
  companyUsers: User[];
  onlyOneUser?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<number[]>([]);
  const [priority, setPriority] = useState<Priority>("Low");
  const [time, setTime] = useState<{ startTime: string; endTime: string }>();

  const handleSave = () => {
    console.log({
      title,
      description,
      assignedUsers,
      priority,
      startTime: time?.startTime,
      endTime: time?.endTime,
    });

    // reset form
    setTitle("");
    setDescription("");
    setAssignedUsers([]);
    setPriority("Low");
    setTime(undefined);

    setOpen(false);
  };

  function onChange(e: any) {
    if (!e) return;

    const [start, end] = e;
    setTime({
      startTime: start?.format("HH:mm"),
      endTime: end?.format("HH:mm"),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          role="button"
          className="group rounded-md border-2 border-[#66738C] bg-white px-2 text-center text-xs text-gray-500"
        >
          Add Task
        </div>
        {/* Hover content */}
        <div className="absolute -top-32 left-1/3 z-50 mt-1 hidden w-[100px] -translate-x-1/2 transform rounded-lg border border-[#66738C] bg-white p-2 group-hover:block">
          <div className="mb-2 rounded-[3px] bg-[#6571FF] p-1 text-white">
            Task 1
          </div>
          <div className="mb-2 rounded-[3px] bg-[#25AADD] p-1 text-white">
            Task 2
          </div>
          <div className="rounded-[3px] bg-[#006D77] p-1 text-white">
            Task 3
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <form>
          <div className="mb-4 flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              className="mt-2 rounded-md border-2 border-gray-500 p-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              className="mt-2 rounded-md border-2 border-gray-500 p-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="timer-parent" className="mb-4 flex flex-col">
            <label htmlFor="time">Time</label>
            <TimePicker.RangePicker
              id="time"
              onChange={onChange}
              getPopupContainer={() => document.getElementById("timer-parent")!}
              use12Hours
              format="h:mm a"
              className="mt-2 rounded-md border-2 border-gray-500 p-1 placeholder-slate-800"
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="assigned_users">Assign</label>
            <button
              onClick={() => setShowUsers(!showUsers)}
              type="button"
              className="flex w-full items-center justify-end rounded-md border-2 border-gray-500 p-2"
            >
              {showUsers ? (
                <FaChevronUp className="text-[#797979]" />
              ) : (
                <FaChevronDown className="text-[#797979]" />
              )}
            </button>

            {!onlyOneUser && showUsers && (
              <div className="mt-2 flex h-40 flex-col gap-2 overflow-y-auto p-2 font-bold">
                {companyUsers.map((user) => (
                  <label
                    htmlFor={user.id.toString()}
                    key={user.id}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      name="assigned_users"
                      id={user.id.toString()}
                      value={user.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignedUsers([...assignedUsers, user.id]);
                        } else {
                          setAssignedUsers(
                            assignedUsers.filter((id) => id !== user.id),
                          );
                        }
                      }}
                    />

                    <Avatar photo={user.image} width={40} height={40} />
                    <span>
                      {user?.firstName} {user?.lastName}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4 flex flex-col">
            <label>Priority</label>
            <div className="flex items-center gap-5">
              <button
                className="relative flex w-full items-center justify-center rounded-md bg-[#6571FF] p-2 text-white"
                onClick={() => setPriority("Low")}
                type="button"
              >
                Low
                {priority === "Low" && (
                  <FaCheck className="absolute right-2 text-white" />
                )}
              </button>
              <button
                className="relative flex w-full items-center justify-center rounded-md bg-[#25AADD] p-2 text-white"
                onClick={() => setPriority("Medium")}
                type="button"
              >
                Medium
                {priority === "Medium" && (
                  <FaCheck className="absolute right-2 text-white" />
                )}
              </button>
              <button
                className="relative flex w-full items-center justify-center rounded-md bg-[#006D77] p-2 text-white"
                onClick={() => setPriority("High")}
                type="button"
              >
                High
                {priority === "High" && (
                  <FaCheck className="absolute right-2 text-white" />
                )}
              </button>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button type="button" className="rounded-md border px-4 py-1">
                Cancel
              </button>
            </DialogClose>

            <button
              type="button"
              className="rounded-md border bg-[#6571FF] px-4 py-1 text-white"
              onClick={handleSave}
            >
              Add
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
