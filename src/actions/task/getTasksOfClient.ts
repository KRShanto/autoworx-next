"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { User } from "@prisma/client";

export default async function getTasksOfClient(clientId: number) {
  let companyId = await getCompanyId();

  const tasks = await db.task.findMany({
    where: {
      companyId,
      clientId,
    },
  });
  let taskWithAssignedUsers = [];
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
  return taskWithAssignedUsers;
}
