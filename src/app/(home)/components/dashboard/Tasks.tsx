import { deleteTask } from "@/actions/task/deleteTask";
import { cn } from "@/lib/cn";
import { usePopupStore } from "@/stores/popup";
import { Task as TaskType, User } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaExternalLinkAlt, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import NewTask from "../../../task/[type]/components/task/NewTask";

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
    <div className="h-full flex-1 overflow-y-auto shadow-md">
      <div
        className={`flex h-full flex-col overflow-y-auto rounded-md p-6 shadow-lg`}
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
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-x-4 rounded px-3 py-2 text-sm text-white cursor-pointer",
        {
          "bg-[#6571FF]": task.priority === "Low",
          "bg-[#25AADD]": task.priority === "Medium",
          "bg-[#006d77]": task.priority === "High",
        },
      )}
      onClick={() => {
        router.push(
          `/task/day?date=${moment.utc(task?.date).format("YYYY-MM-DD")}`,
        );
      }}
    >
      <span>
        {task.title.length > 20 ? task.title.slice(0, 20) + "..." : task.title}
      </span>
      <span className="flex items-center gap-x-2">
        <MdOutlineEdit
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            open("UPDATE_TASK", {
              task,
              companyUsers,
            });
          }}
        />

        <FaRegCheckCircle
          className="cursor-pointer"
          onClick={async (e) => {
            e.stopPropagation();
            await deleteTask(task.id);
          }}
        />
      </span>
    </div>
  );
};

export default Tasks;
