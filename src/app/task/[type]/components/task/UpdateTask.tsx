"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import Submit from "@/components/Submit";
import { usePopupStore } from "@/stores/popup";
import type { CalendarTask } from "@/types/db";
import type { Priority, User } from "@prisma/client";
import { TimePicker } from "antd";
import Image from "next/image";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTractor, FaTrash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { editTask } from "../../../../../actions/task/editTask";
// @ts-ignore
import dayjs from "dayjs";
import { deleteTask } from "../../../../../actions/task/deleteTask";
import Avatar from "@/components/Avatar";

export default function UpdateTask() {
  const { popup, data, close } = usePopupStore();
  const { companyUsers, task } = data as {
    companyUsers: User[];
    task: CalendarTask;
  };
  const [showUsers, setShowUsers] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignedUsers, setAssignedUsers] = useState<number[]>(
    task.assignedUsers.map((user) => user.id),
  );
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [time, setTime] = useState<{ startTime: string; endTime: string }>({
    startTime: task.startTime,
    endTime: task.endTime,
  });

  async function handleSubmit() {
    const res = await editTask({
      id: task.id,
      task: {
        title,
        description,
        assignedUsers,
        priority,
        startTime: time?.startTime,
        endTime: time?.endTime,
      },
    });

    close();
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
    <Dialog open={popup === "UPDATE_TASK"} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
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
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="timer-parent" className="mb-4 flex flex-col">
            <label htmlFor="time">Time</label>
            <TimePicker.RangePicker
              onChange={onChange}
              getPopupContainer={() => document.getElementById("timer-parent")!}
              use12Hours
              format="h:mm a"
              className="mt-2 rounded-md border-2 border-gray-500 p-1 placeholder-slate-800"
              value={[
                dayjs(time.startTime, "HH:mm"),
                dayjs(time.endTime, "HH:mm"),
              ]}
              needConfirm={false}
            />
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

            {showUsers && (
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
                      checked={assignedUsers.includes(user.id)}
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

          <div className="flex">
            <button
              className="text-xl text-red-500 hover:text-red-700"
              type="button"
              onClick={async () => {
                await deleteTask(task.id);
                close();
              }}
            >
              <FaTrash />
            </button>

            <DialogFooter className="w-full">
              <DialogClose className="rounded-md border px-4 py-1">
                Cancel
              </DialogClose>
              <Submit
                className="rounded-md border bg-[#6571FF] px-4 py-1 text-white"
                formAction={handleSubmit}
              >
                Save
              </Submit>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
