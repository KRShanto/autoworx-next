import Day from "./Day";
import Week from "./Week";
import Month from "./Month";
import { CalendarType } from "@/types/calendar";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { db } from "@/lib/db";
import { User } from "@prisma/client";

export default async function Body({ type }: { type: CalendarType }) {
  const session = (await auth()) as AuthSession;

  // Tasks with assigned users
  // Here we will store both the task and the assigned users
  const taskWithAssignedUsers = [];

  // Get all the tasks for the company
  const tasks = await db.task.findMany({
    where: {
      companyId: session.user.companyId,
    },
  });

  // Loop through all the tasks
  for (const task of tasks) {
    let assignedUsers: User[] = [];

    // Get the assigned users for the task
    const taskUsers = (await db.taskUser.findMany({
      where: {
        taskId: task.id,
      },
    })) as any;

    // Get the user details for the assigned users
    for (const taskUser of taskUsers) {
      const user = (await db.user.findUnique({
        where: {
          id: taskUser.userId,
        },
      })) as User;

      // Add the user to the assigned users array
      assignedUsers.push(user);
    }

    // Add the task and the assigned users to the array
    taskWithAssignedUsers.push({
      ...task,
      assignedUsers,
    });
  }

  // Get all the users for the company
  const companyUsers = await db.user.findMany({
    where: {
      companyId: session.user.companyId,
    },
  });

  if (type === "day")
    return <Day tasks={taskWithAssignedUsers} companyUsers={companyUsers} />;
  if (type === "week")
    return <Week tasks={taskWithAssignedUsers} companyUsers={companyUsers} />;
  if (type === "month") return <Month tasks={taskWithAssignedUsers} />;
}
