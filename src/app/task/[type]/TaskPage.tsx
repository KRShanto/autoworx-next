"use client";

import { CalendarType } from "@/types/calendar";
import { AppointmentFull, CalendarAppointment } from "@/types/db";
import type { EmailTemplate } from "@prisma/client";
import {
  CalendarSettings,
  Customer,
  Order,
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
  tags,
  customers,
  vehicles,
  orders,
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
  tags: string[];
  customers: Customer[];
  vehicles: Vehicle[];
  orders: Order[];
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
  const tasksWithoutTime = taskWithAssignedUsers.filter(
    (task) => !task.startTime && !task.endTime && !task.date,
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <CalendarSidebar
        usersWithTasks={usersWithTasks}
        tasks={tasks}
        tags={tags}
        appointments={appointments as any}
      />
      <Calendar
        type={type}
        tasks={calendarTasks as any}
        tasksWithoutTime={tasksWithoutTime}
        companyUsers={companyUsers}
        customers={customers}
        vehicles={vehicles}
        orders={orders}
        settings={settings}
        appointments={appointments}
        templates={templates}
        appointmentsFull={appointmentsFull}
      />
    </DndProvider>
  );
}
