import { TooltipTrigger } from "@/components/Tooltip";
import { usePopupStore } from "@/stores/popup";
import { AppointmentFull } from "@/types/db";
import React, { ReactElement } from "react";
import { useDrag } from "react-dnd";

export default function DraggableDayTooltip({
  children,
  style,
  task,
  updateTaskData,
  ...props
}: {
  children: ReactElement;
  style: any;
  task: any;
  updateTaskData: {
    event: any;
    companyUsers: any;
  };
}) {
  const { open } = usePopupStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: task.type,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDragStart = (event: any) => {
    event.dataTransfer.setData("text/plain", `${task.type}|${task.id}`);
  };

  const { event, companyUsers } = updateTaskData;

  return (
    <TooltipTrigger
      {...props}
      // @ts-ignore
      ref={drag}
      onDragStart={handleDragStart}
      className="absolute top-0 z-10 rounded-lg border bg-red-400 px-2 py-1 text-[17px] text-white hover:z-20"
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "pointer",
      }}
      onClick={() =>
        open("UPDATE_TASK", {
          task: event,
          companyUsers,
        })
      }
      {...props}
    >
      {children}
    </TooltipTrigger>
  );
}
