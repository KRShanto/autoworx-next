import { deleteTask } from "@/actions/task/deleteTask";
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
    <div className="#text-lg flex items-center justify-between gap-x-4 rounded-md bg-[#6571FF] px-3 py-2 text-white">
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
