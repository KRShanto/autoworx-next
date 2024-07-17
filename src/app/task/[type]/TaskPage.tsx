"use client";

import { CalendarType } from "@/types/calendar";
import { AppointmentFull, CalendarAppointment } from "@/types/db";
import type { EmailTemplate } from "@prisma/client";
import {
  CalendarSettings,
  Customer,
  Task,
  User,
  Vehicle,
} from "@prisma/client";
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
}: {
  type: CalendarType;
  taskWithAssignedUsers: (Task & { assignedUsers: User[] })[];
  companyUsers: User[];
  usersWithTasks: any; // TODO: Fix this type
  tasks: Task[];
  customers: Customer[];
  vehicles: Vehicle[];
  settings: CalendarSettings;
  appointments: CalendarAppointment[];
  templates: EmailTemplate[];
  appointmentsFull: AppointmentFull[];
}) {
  // Filter the tasks where startTime, endTime, and date are not null
  const calendarTasks = taskWithAssignedUsers.filter(
    (task) => task.startTime && task.endTime && task.date,
  );
  // Filter the tasks without startTime, endTime, and date
  const tasksWithoutTime = taskWithAssignedUsers.filter((task) => !task.date);

  return (
    <DndProvider backend={HTML5Backend}>
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
      />
    </DndProvider>
  );
}
