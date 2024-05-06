import { TASK_COLOR } from "@/lib/consts";
import React, { LegacyRef } from "react";
import { Appointment, Task } from "@prisma/client";
import { useDrag } from "react-dnd";
import { FaRegCheckCircle } from "react-icons/fa";
import { deleteTask } from "../../delete";
import { deleteAppointment } from "../../deleteAppointment";

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

  if (!appointment.date) {
    return (
      <div
        className="cursor-move rounded-md bg-slate-500 px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]"
        style={{
          opacity: isDragging ? 0.5 : 1,
        }}
        ref={drag as unknown as LegacyRef<HTMLDivElement>}
        draggable
        onDragStart={handleDragStart}
      >
        {appointment.title}
      </div>
    );
  }

  return (
    <div className="flex items-center rounded-md bg-slate-500 px-4 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]">
      <p className="w-[90%]">{appointment.title}</p>
      <FaRegCheckCircle
        className="cursor-pointer text-xl text-white"
        onClick={handleDelete}
      />
    </div>
  );
}
