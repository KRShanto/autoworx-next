import { deleteTask } from "@/actions/task/deleteTask";
import { cn } from "@/lib/cn";
import { usePopupStore } from "@/stores/popup";
import { Task as TaskType, User } from "@prisma/client";
import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

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

export default Task;
