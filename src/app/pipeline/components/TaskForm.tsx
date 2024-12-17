"use client";

import { createTask } from "@/actions/task/createTask";
import AssignTaskDropDown from "@/app/task/[type]/components/task/AssignTaskDropDown";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { Priority, Task, User } from "@prisma/client";
import { TimePicker } from "antd";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

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
  const [date, setDate] = useState<string>("");

  const handleSave = async () => {
    // save task
    const res = await createTask({
      title,
      description,
      assignedUsers,
      priority,
      startTime: time?.startTime,
      endTime: time?.endTime,
      invoiceId,
      date: date ? new Date(date).toISOString() : undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
          <div
            className="absolute -left-36 z-[9999] mt-1 hidden h-[110px] max-h-[120px] w-[200px] transform overflow-y-auto rounded-lg border border-[#66738C] bg-white p-2 group-hover:block"
            style={{ top: "-7rem" }}
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

          <AssignTaskDropDown
            assignedUsers={assignedUsers}
            companyUsers={companyUsers!}
            setAssignedUsers={setAssignedUsers}
          />

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
