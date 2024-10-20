"use client";

import DnDWrapper from "@/components/DnDWrapper";
import { CalendarType } from "@/types/calendar";
import { AppointmentFull, CalendarAppointment } from "@/types/db";
import type { EmailTemplate } from "@prisma/client";
import { CalendarSettings, Client, Task, User, Vehicle } from "@prisma/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Calendar from "./Calendar/Calendar";
import CalendarSidebar from "./CalendarSidebar/CalendarSidebar";

export default function TaskPage({
  type,
  taskWithAssignedUsers,
  companyUsers,
  usersWithTasks,
  tasks,
  customers,
  vehicles,
  settings,
  appointments,
  templates,
  appointmentsFull,
  user,
}: {
  type: CalendarType;
  taskWithAssignedUsers: (Task & { assignedUsers: User[] })[];
  companyUsers: User[];
  usersWithTasks: any; // TODO: Fix this type
  tasks: Task[];
  customers: Client[];
  vehicles: Vehicle[];
  settings: CalendarSettings;
  appointments: CalendarAppointment[];
  templates: EmailTemplate[];
  appointmentsFull: AppointmentFull[];
  user: User;
}) {
  // Filter the tasks where startTime, endTime, and date are not null
  const calendarTasks = taskWithAssignedUsers.filter(
    (task) => task.startTime && task.endTime && task.date,
  );
  // Filter the tasks without startTime, endTime, and date
  const tasksWithoutTime = taskWithAssignedUsers.filter((task) => !task.date);

  return (
    <DnDWrapper id="task">
      <CalendarSidebar usersWithTasks={usersWithTasks} tasks={tasks} />
      <Calendar
        type={type}
        tasks={calendarTasks as any}
        tasksWithoutTime={tasksWithoutTime}
        companyUsers={companyUsers}
        customers={customers}
        vehicles={vehicles}
        settings={settings}
        appointments={appointments}
        templates={templates}
        appointmentsFull={appointmentsFull}
        user={user}
      />
    </DnDWrapper>
  );
}
