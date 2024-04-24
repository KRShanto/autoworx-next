"use client";

import { useCalendarSidebarStore } from "../../../../stores/calendarSidebar";
import Users from "./Users";
import { Task } from "@prisma/client";
import Tasks from "./Tasks";

export default function Body({
  usersWithTasks,
  tasks,
  tags,
}: {
  usersWithTasks: any;
  tasks: Task[];
  tags: string[];
}) {
  const { type } = useCalendarSidebarStore();

  if (type === "USERS") return <Users users={usersWithTasks} tasks={tasks} />;
  if (type === "TASKS")
    return <Tasks tasks={tasks} users={usersWithTasks} tags={tags} />;
}
