import { deleteTask } from "@/actions/task/deleteTask";
import { cn } from "@/lib/cn";
import { usePopupStore } from "@/stores/popup";
import { Task as TaskType, User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import NewTask from "../task/[type]/components/task/NewTask";

const Tasks = ({
  tasks,
  companyUsers,
  fullHeight = false,
}: {
  tasks: TaskType[];
  companyUsers: User[];
  fullHeight?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col rounded-md p-6 shadow-lg ${fullHeight ? "h-[82vh]" : "h-[38vh]"}`}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xl font-bold">Task List</span>{" "}
        <Link href="/task/day">
          <FaExternalLinkAlt />
        </Link>
      </div>
      <div className="custom-scrollbar my-2 flex flex-1 flex-col space-y-2 overflow-x-hidden">
        {tasks.map((task, idx) => (
          <Task key={idx} task={task} companyUsers={companyUsers} />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center self-center text-center">
            <span>You have no upcoming tasks</span>
          </div>
        )}
      </div>
      <div className="mt-auto w-20 rounded-full">
        <NewTask companyUsers={companyUsers} />
      </div>
    </div>
  );
};
const Task = ({
  task,
  companyUsers,
}: {
  task: TaskType;
  companyUsers: User[];
}) => {
  const { open } = usePopupStore();

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-x-4 rounded px-3 py-2 text-sm text-white",
        {
          "bg-[#6571FF]": task.priority === "Low",
          "bg-[#25AADD]": task.priority === "Medium",
          "bg-[#006d77]": task.priority === "High",
        },
      )}
    >
      <span>
        {task.title.length > 20 ? task.title.slice(0, 20) + "..." : task.title}
      </span>
      <span className="flex items-center gap-x-2">
        <MdOutlineEdit
          className="cursor-pointer"
          onClick={() => {
            open("UPDATE_TASK", {
              task,
              companyUsers,
            });
          }}
        />

        <FaRegCheckCircle
          className="cursor-pointer"
          onClick={async () => {
            await deleteTask(task.id);
          }}
        />
      </span>
    </div>
  );
};

export default Tasks;
