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
import Image from "next/image";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { editTask } from "../../actions/editTask";

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

  async function handleSubmit() {
    const res = await editTask({
      id: task.id,
      task: {
        title,
        description,
        assignedUsers,
        priority,
      },
    });

    close();
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
              autoFocus
            />
          </div>

          {/* custom radio. show user name and image (column)*/}
          {/* TODO */}
          <div className="mb-4 flex flex-col">
            <label htmlFor="assigned_users">Assign</label>

            <div className="flex w-full items-center justify-end rounded-md border p-1">
              <button onClick={() => setShowUsers(!showUsers)} type="button">
                {showUsers ? (
                  <FaChevronUp className="text-[#797979]" />
                ) : (
                  <FaChevronDown className="text-[#797979]" />
                )}
              </button>
            </div>

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
                    />
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{user.name}</span>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
