import { TASK_COLOR } from "@/lib/consts";
import React, { LegacyRef } from "react";
import { Task } from "@prisma/client";
import { useDrag } from "react-dnd";
import { FaRegCheckCircle } from "react-icons/fa";
import { deleteTask } from "../../delete";

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

  if (!task.date) {
    return (
      <div
        className="cursor-move rounded-md px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]"
        style={{
          backgroundColor: TASK_COLOR[task.priority],
          opacity: isDragging ? 0.5 : 1,
        }}
        ref={drag as unknown as LegacyRef<HTMLDivElement>}
        draggable
        onDragStart={handleDragStart}
      >
        {task.title}
      </div>
    );
  }

  return (
    <div
      className="flex items-center rounded-md px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]"
      style={{
        backgroundColor: TASK_COLOR[task.priority],
      }}
    >
      <p className="w-[90%]">{task.title}</p>
      <FaRegCheckCircle
        className="cursor-pointer text-xl text-white"
        onClick={handleDelete}
      />
    </div>
  );
}
