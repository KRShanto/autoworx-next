import Title from "@/components/Title";
import Calendar from "./Calendar/Calendar";
import CalendarUser from "./Users/CalendarUser";
import { Metadata } from "next";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { AuthSession } from "@/types/auth";
import { auth } from "@/app/auth";
import { CalendarType } from "@/types/calendar";
import TaskPage from "./TaskPage";
import { CalendarTask } from "@/types/db";

export const metadata: Metadata = {
  title: "Task and Activity Management",
};

export default async function Page({ params }: { params: { type: string } }) {
  const session = (await auth()) as AuthSession;

  // Tasks with assigned users
  // Here we will store both the task and the assigned users
  const taskWithAssignedUsers = [];

  // Get all the tasks for the company
  // where startTime, endTime, and date are not null
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

  const usersWithTasks = [];

  const users = await db.user.findMany();

  for (const user of users) {
    const taskUsers = await db.taskUser.findMany({
      where: { userId: user.id },
    });

    const tasks = await db.task.findMany({
      where: {
        id: {
          in: taskUsers.map((taskUser) => taskUser.taskId),
        },
      },
    });

    usersWithTasks.push({
      ...user,
      tasks,
    });
  }

  return (
    <>
      <Title>Task and Activity Management</Title>

      <div className="relative flex h-[81vh]">
        <TaskPage
          type={params.type as CalendarType}
          taskWithAssignedUsers={taskWithAssignedUsers}
          companyUsers={companyUsers}
          usersWithTasks={usersWithTasks}
          tasks={tasks}
        />
      </div>
    </>
  );
}
