import { TASK_COLOR } from "@/lib/consts";
import React, { LegacyRef } from "react";
import { Appointment, Task } from "@prisma/client";
import { useDrag } from "react-dnd";
import { FaRegCheckCircle } from "react-icons/fa";
import { deleteTask } from "../../delete";
import { deleteAppointment } from "../../deleteAppointment";
import { cn } from "@/lib/cn";

export default function AppointmentComponent({
  appointment,
}: {
  appointment: Appointment;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "appointment",
    item: { type: "appointment", id: appointment.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("text/plain", `appointment|${appointment.id}`);
  };

  const handleDelete = async () => {
    await deleteAppointment(appointment.id);
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-md bg-slate-500 px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]",
        {
          "cursor-move": !appointment.date,
        },
      )}
      ref={
        appointment.date
          ? undefined
          : (drag as unknown as LegacyRef<HTMLDivElement>)
      }
      draggable={appointment.date ? false : true}
      onDragStart={appointment.date ? undefined : handleDragStart}
    >
      <p className="w-[90%]">{appointment.title}</p>
      <FaRegCheckCircle
        className="cursor-pointer text-xl text-white"
        onClick={handleDelete}
      />
    </div>
  );
}
