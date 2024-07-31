import { TASK_COLOR } from "@/lib/consts";
import React, { LegacyRef } from "react";
import { Task } from "@prisma/client";
import { useDrag } from "react-dnd";
import { FaRegCheckCircle } from "react-icons/fa";
import { deleteTask } from "../../../../actions/task/deleteTask";
import moment from "moment";
import Link from "next/link";

export default function TaskComponent({ task }: { task: Task }) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { type: "task", id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", `task|${task.id}`);
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
  };
  const existingDate = moment(task?.date).format("YYYY-MM-DD");
  // console.log({existingDate});
  return (
    <div
      className="flex items-center rounded-md px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]"
      style={{
        backgroundColor: TASK_COLOR[task.priority],
        cursor: task.date ? "pointer" : "move",
      }}
      ref={
        task.date ? undefined : (drag as unknown as LegacyRef<HTMLDivElement>)
      }
      draggable={task.date ? false : true}
      onDragStart={task.date ? undefined : handleDragStart}
    >
      <Link href={`/task/day?date=${existingDate}`} className="w-[90%]">
        {task.title}
      </Link>
      <FaRegCheckCircle
        className="cursor-pointer text-xl text-white hover:text-gray-400"
        onClick={handleDelete}
      />
    </div>
  );
}
