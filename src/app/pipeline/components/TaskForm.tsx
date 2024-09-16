"use client";

import { Priority, Task, User } from "@prisma/client";
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
import { createTask } from "@/actions/task/createTask";

export default function TaskForm({
  companyUsers,
  onlyOneUser = false,
  invoiceId,
  previousTasks,
}: {
  companyUsers: User[] | null;
  onlyOneUser?: boolean;
  invoiceId: string;
  previousTasks: Task[];
}) {
  const [open, setOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<number[]>([]);
  const [priority, setPriority] = useState<Priority>("Low");
  const [time, setTime] = useState<{ startTime: string; endTime: string }>();
  const [tasks, setTasks] = useState<Task[]>(previousTasks);

  const handleSave = async () => {
    console.log({
      title,
      description,
      assignedUsers,
      priority,
      startTime: time?.startTime,
      endTime: time?.endTime,
    });

    // save task
    const res = await createTask({
      title,
      description,
      assignedUsers,
      priority,
      startTime: time?.startTime,
      endTime: time?.endTime,
      invoiceId,
    });

    if (res.type === "success") {
      // update tasks
      setTasks([...tasks, res.data]);
    }

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
        {tasks.length > 0 && (
         <div className="absolute  z-[9999] mt-1 hidden w-[200px] h-[110px] max-h-[120px] -left-36 transform rounded-lg border border-[#66738C] bg-white p-2 overflow-y-auto group-hover:block"
         style={{ top: '-7rem' }}
         >
            {tasks.map((task) => (
              <div
                key={task.id}
                className="mb-2 rounded-[3px] p-1 text-white"
                style={{
                  backgroundColor:
                    task.priority === "Low"
                      ? "#6571FF"
                      : task.priority === "Medium"
                        ? "#25AADD"
                        : "#006D77",
                }}
              >
                {task.title}
              </div>
            ))}
          </div>
        )}
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
                {companyUsers &&
                  companyUsers.map((user) => (
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
