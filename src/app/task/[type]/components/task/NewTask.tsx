"use client";

import Avatar from "@/components/Avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import Submit from "@/components/Submit";
import { Priority, User } from "@prisma/client";
import { TimePicker } from "antd";
import Image from "next/image";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { createTask } from "../../../../../actions/task/createTask";
import moment from "moment";

export default function NewTask({
  companyUsers,
  onlyOneUser = false,
  isClientTask = false,
  clientId = null,
}: {
  companyUsers: User[];
  onlyOneUser?: boolean;
  isClientTask?: boolean;
  clientId?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<number[]>([]);
  const [priority, setPriority] = useState<Priority>("Low");
  const [time, setTime] = useState<{ startTime: string; endTime: string }>();
  const [date, setDate] = useState<string>("");

  async function handleSubmit() {
    const res = await createTask({
      title,
      description,
      assignedUsers,
      priority,
      startTime: time?.startTime,
      endTime: time?.endTime,
      clientId,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    });

    // reset form
    setTitle("");
    setDescription("");
    setAssignedUsers([]);
    setPriority("Low");
    setTime(undefined);

    setOpen(false);
  }

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
      <DialogTrigger asChild>
        {/* if its a task which will be created from C.Hub Client, then it will show a different styled button  */}
        {isClientTask ? (
          <button className="rounded-full bg-gray-400 px-6 py-1 text-white">
            <FaPlus />
          </button>
        ) : (
          <button className="w-full rounded-md bg-[#797979] p-2 text-[17px] text-white max-[1300px]:py-1 max-[1300px]:text-[14px]">
            <FaPlus className="mx-auto block" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
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
              required
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
            <div className="flex items-center space-x-2">
              <input
                id="time"
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-md border-2 border-gray-500 p-0.5 placeholder-slate-800"
                type="date"
              />
              <TimePicker.RangePicker
                id="time"
                onChange={onChange}
                getPopupContainer={() =>
                  document.getElementById("timer-parent")!
                }
                use12Hours
                format="h:mm a"
                className="mt-2 w-full rounded-md border-2 border-gray-500 p-1 placeholder-slate-800"
                needConfirm={false}
              />
            </div>
          </div>

          {/* custom radio. show user name and image (column)*/}
          {/* TODO */}
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
                      {user.firstName} {user.lastName}
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
            <Submit
              className="rounded-md border bg-[#6571FF] px-4 py-1 text-white"
              formAction={handleSubmit}
            >
              Save
            </Submit>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
