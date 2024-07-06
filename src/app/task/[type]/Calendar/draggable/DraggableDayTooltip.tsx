import { TooltipTrigger } from "@/components/Tooltip";
import { usePopupStore } from "@/stores/popup";
import React, { ReactElement } from "react";
import { useDrag } from "react-dnd";

export default function DraggableDayTooltip({
  children,
  style,
  task,
  updateTaskData,
  updateAppointmentData,
  ...props
}: {
  children: ReactElement;
  style: any;
  task: any;
  updateTaskData: {
    event: any;
    companyUsers: any;
  };
  updateAppointmentData: {
    appointment: any;
    employees: any;
    customers: any;
    vehicles: any;
    orders: any;
    templates: any;
    settings: any;
  };
}) {
  const { open } = usePopupStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDragStart = (event: any) => {
    event.dataTransfer.setData("text/plain", `${task.type}|${task.id}`);
  };

  const { event, companyUsers } = updateTaskData;
  const {
    appointment,
    customers,
    employees,
    vehicles,
    orders,
    templates,
    settings,
  } = updateAppointmentData;

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
      onClick={() => {
        if (event.type === "task") {
          open("UPDATE_TASK", {
            task: event,
            companyUsers,
          });
        } else {
          open("UPDATE_APPOINTMENT", {
            appointment,
            employees,
            customers,
            vehicles,
            orders,
            templates,
            settings,
          });
        }
      }}
      {...props}
    >
      {children}
    </TooltipTrigger>
  );
}
