"use client";

import Calendar from "./Calendar/Calendar";
import CalendarSidebar from "./CalendarSidebar/CalendarSidebar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  CalendarSettings,
  Customer,
  Order,
  Task,
  User,
  Vehicle,
} from "@prisma/client";
import { CalendarType } from "@/types/calendar";

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
      />
    </DndProvider>
  );
}
