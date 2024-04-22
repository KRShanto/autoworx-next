import { TASK_COLOR } from "@/lib/consts";
import React, { LegacyRef } from "react";
import { Task } from "@prisma/client";
import { useDrag } from "react-dnd";

export default function TaskComponent({ task }: { task: Task }) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { type: "task", id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", task.id.toLocaleString());
  };

  return (
    <div
      className="cursor-move rounded-full px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]"
      style={{
        backgroundColor: TASK_COLOR[task.type],
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
