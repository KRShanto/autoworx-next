"use client";

import Calendar from "./Calendar/Calendar";
import CalendarUser from "./Users/CalendarUser";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task, User } from "@prisma/client";
import { CalendarType } from "@/types/calendar";

export default function TaskPage({
  type,
  taskWithAssignedUsers,
  companyUsers,
  usersWithTasks,
  tasks,
}: {
  type: CalendarType;
  taskWithAssignedUsers: (Task & { assignedUsers: User[] })[];
  companyUsers: User[];
  usersWithTasks: any; // TODO: Fix this type
  tasks: Task[];
}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Calendar
        type={type}
        taskWithAssignedUsers={taskWithAssignedUsers}
        companyUsers={companyUsers}
      />
      <CalendarUser usersWithTasks={usersWithTasks} tasks={tasks} />
    </DndProvider>
  );
}
