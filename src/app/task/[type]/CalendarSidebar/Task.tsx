import { TASK_COLOR } from "@/lib/consts";
import { Task } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { LegacyRef } from "react";
import { useDrag } from "react-dnd";
import { FaRegCheckCircle } from "react-icons/fa";
import { deleteTask } from "../../../../actions/task/deleteTask";
import { useDate } from "../Calendar/Day";

export default function TaskComponent({ task }: { task: Task }) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { type: "task", id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const router = useRouter();
  const queryDate = useDate();

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", `task|${task.id}`);
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
  };

  const existingDate = task?.date
    ? moment.utc(task?.date).format("YYYY-MM-DD")
    : queryDate.format("YYYY-MM-DD");

  const handleDragEnd = () => {
    router.push(`/task/day?date=${existingDate}`);
  };
  return (
    <div
      className="flex items-center rounded-md px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]"
      style={{
        backgroundColor: TASK_COLOR[task.priority],
        cursor: task.startTime && task.endTime ? "pointer" : "move",
      }}
      ref={
        task.startTime && task.endTime
          ? undefined
          : (drag as unknown as LegacyRef<HTMLDivElement>)
      }
      draggable={task.startTime && task.endTime ? false : true}
      onDragStart={task.startTime && task.endTime ? undefined : handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Link
        style={{
          cursor: task.startTime && task.endTime ? "pointer" : "move",
        }}
        href={`/task/day?date=${existingDate}`}
        className="w-[90%]"
      >
        {task.title}
      </Link>
      <FaRegCheckCircle
        className="text-xl text-white hover:text-gray-400"
        onClick={handleDelete}
      />
    </div>
  );
}
