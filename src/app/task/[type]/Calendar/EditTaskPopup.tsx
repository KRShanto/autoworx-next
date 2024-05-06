import { usePopupStore } from "@/stores/popup";
import { ThreeDots } from "react-loader-spinner";
import { useState } from "react";
import { useFormErrorStore } from "@/stores/form-error";
import { User } from "next-auth";
import { editTask } from "../../edit";
import Input from "@/components/Input";
import Image from "next/image";
import Submit from "@/components/Submit";
import FormError from "@/components/FormError";
import Popup from "@/components/Popup";
import moment from "moment";

interface TaskForm {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  assigned_users: number[];
  timezone: string;
}

export default function EditTaskComponent({
  title = "Edit Schedule",
}: {
  title?: string;
}) {
  const { data: taskData, close } = usePopupStore();
  const { showError } = useFormErrorStore();

  const [titleData, setTitleData] = useState(taskData.title);
  const [date, setDate] = useState(taskData.date);
  const [startTime, setStartTime] = useState(taskData.startTime);
  const [endTime, setEndTime] = useState(taskData.endTime);
  // const [type, setType] = useState<TaskType>(taskData.type);
  const [assignedUsers, setAssignedUsers] = useState<number[]>(
    taskData.assignedUsers || [],
  );
  const companyUsers: User[] = taskData.companyUsers || [];

  async function handleSubmit() {
    if (titleData === "") return;

    const res = await editTask({
      task: {
        title: titleData,
        date,
        startTime: startTime,
        endTime: endTime,
        type: "task",
        assignedUsers,
      },
      id: taskData.id,
    });

    close();
  }

  return (
    <Popup>
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
            value={moment(date).format("YYYY-MM-DD")}
            onChange={(e) => setDate(e.target.value)}
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

        {/*
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
        */}

        {/* custom radio. show user name and image (column)*/}
        <div className="mb-4 flex flex-col">
          <label htmlFor="assigned_users" className="font-bold">
            {taskData.only_one_user ? "Assigned User" : "Assigned Users"}
          </label>

          {!taskData.only_one_user && (
            <div className="mt-2 flex h-40 flex-col gap-2 overflow-y-auto p-2 font-bold">
              {companyUsers.map((user) => (
                <label
                  htmlFor={user.id!.toString()}
                  key={user.id}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    name="assigned_users"
                    id={user.id!.toString()}
                    value={user.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // @ts-ignore
                        setAssignedUsers([...assignedUsers, user.id]);
                      } else {
                        setAssignedUsers(
                          // @ts-ignore
                          assignedUsers.filter((id) => id !== user.id),
                        );
                      }
                    }}
                  />
                  <Image
                    src={user.image!}
                    alt={user.name!}
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
    </Popup>
  );
}
