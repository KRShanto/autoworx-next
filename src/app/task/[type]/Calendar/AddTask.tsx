"use client";

import { useState } from "react";
import { usePopupStore } from "@/stores/popup";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import { TaskType, User } from "@prisma/client";
import Image from "next/image";
import Submit from "@/components/Submit";
import { addTask } from "../../add";
import { useFormErrorStore } from "@/stores/form-error";

export default function AddTask({
  title = "Add Schedule",
  users,
}: {
  title?: string;
  users?: User[];
}) {
  const { data: taskData, close } = usePopupStore();
  const { showError } = useFormErrorStore();

  const [titleData, setTitleData] = useState("");
  const [date, setDate] = useState(taskData.date);
  const [startTime, setStartTime] = useState(taskData.startTime);
  const [endTime, setEndTime] = useState(taskData.endTime);
  const [type, setType] = useState<TaskType>("task");
  const [assignedUsers, setAssignedUsers] = useState<number[]>(
    taskData.assignedUser || [],
  );
  const companyUsers: User[] = taskData.companyUsers || users || [];

  async function handleSubmit() {
    if (titleData === "") return;

    const res = (await addTask({
      title: titleData,
      date,
      startTime: startTime,
      endTime: endTime,
      type,
      assignedUsers: assignedUsers,
    })) as { message?: string; field?: string };

    if (res.message) {
      showError({
        field: res.field || "title",
        message: res.message,
      });
    } else {
      close();
    }
  }

  console.log();

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return (
    <form className="flex w-[40rem] flex-col p-5 text-slate-600">
      {title && <h2 className="text-center text-2xl font-bold">{title}</h2>}

      <FormError />

      <div className="mb-4 flex flex-col">
        <label htmlFor="title" className="font-bold">
          Title
        </label>

        <Input
          type="text"
          name="title"
          className="mt-2 rounded-md border border-gray-300 p-2"
          value={titleData}
          onChange={(e) => setTitleData(e.target.value)}
          autoFocus
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label htmlFor="date" className="font-bold">
          Date
        </label>
        <Input
          type="date"
          name="date"
          className="mt-2 rounded-md border border-gray-300 p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={getCurrentDate()}
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label htmlFor="start_time" className="font-bold">
          Start Time
        </label>
        <Input
          type="time"
          name="startTime"
          className="mt-2 rounded-md border border-gray-300 p-2"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label htmlFor="end_time" className="font-bold">
          End Time
        </label>
        <Input
          type="time"
          name="endTime"
          className="mt-2 rounded-md border border-gray-300 p-2"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div className="mb-4 flex flex-col">
        <label htmlFor="type" className="font-bold">
          Type
        </label>
        <select
          name="type"
          id="type"
          className="mt-2 rounded-md border border-gray-300 p-2"
          value={type}
          onChange={(e) => setType(e.target.value as TaskType)}
        >
          <option value="task">Task</option>
          <option value="appointment">Appointment</option>
          <option value="event">Event</option>
        </select>
      </div>

      {/* custom radio. show user name and image (column)*/}
      <div className="mb-4 flex flex-col">
        <label htmlFor="assigned_users" className="font-bold">
          {taskData.only_one_user ? "Assigned User" : "Assigned Users"}
        </label>

        {!taskData.only_one_user && (
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

      {taskData.only_one_user && (
        // only show the user's name and image. no checkbox
        <div className="mb-5 flex items-center gap-2 rounded-md bg-slate-100 p-2">
          <Image
            src={taskData.assignedUser.image}
            alt={taskData.assignedUser.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <span className="text-[19px]">{taskData.assignedUser.name}</span>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <Submit
          className="rounded-md bg-blue-500 px-10 py-2 text-white"
          formAction={handleSubmit}
        >
          Add Task
        </Submit>
        <button
          type="button"
          className="rounded-md bg-red-800 px-10 py-2 text-white"
          onClick={() => close()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
