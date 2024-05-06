"use client";

import { useCalendarSidebarStore } from "../../../../stores/calendarSidebar";
import Users from "./Users";
import { Appointment, Task } from "@prisma/client";
import Tasks from "./Tasks";

export default function Body({
  usersWithTasks,
  tasks,
  tags,
  appointments,
}: {
  usersWithTasks: any;
  tasks: Task[];
  tags: string[];
  appointments: Appointment[];
}) {
  const { type } = useCalendarSidebarStore();

  if (type === "USERS") return <Users users={usersWithTasks} tasks={tasks} />;
  if (type === "TASKS")
    return (
      <Tasks
        tasks={tasks}
        users={usersWithTasks}
        tags={tags}
        appointments={appointments}
      />
    );
}
