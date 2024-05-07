"use server";

import { db } from "@/lib/db";
// import { TaskType } from "@prisma/client";
import { auth } from "../auth";
import { AuthSession } from "@/types/auth";
import { revalidatePath } from "next/cache";

interface TaskToUpdate {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface TaskToAdd {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  // type: TaskType;
  assignedUsers: number[];
}

interface TagTask {
  tag: string;
  date: string;
  startTime: string;
  endTime: string;
}

export async function addTask(task: TaskToAdd | TaskToUpdate | TagTask) {
  const session = (await auth()) as AuthSession;

  // if ("tag" in task) {
  //   // Find the invoices
  //   const invoices = await db.invoice.findMany({
  //     where: {
  //       companyId: session.user.companyId,
  //     },
  //   });

  //   const taggedInvoices = invoices.filter((invoice) => {
  //     return invoice.tags.includes(task.tag);
  //   });

  //   for (const invoice of taggedInvoices) {
  //     const serviceId = (invoice.serviceIds as number[])[0];

  //     const service = await db.service.findUnique({
  //       where: {
  //         id: serviceId,
  //       },
  //     });

  //     await db.task.create({
  //       data: {
  //         title: service?.name!,
  //         date: new Date(task.date),
  //         startTime: task.startTime,
  //         endTime: task.endTime,
  //         type: TaskType.task,
  //         userId: parseInt(session.user.id),
  //         companyId: session.user.companyId,
  //       },
  //     });

  //     // TODO: Add the task to the user's Google Calendar
  //   }
  // } else if ("id" in task) {
  //   // Check if the task exist
  //   const existingTask = await db.task.findFirst({
  //     where: {
  //       id: task.id,
  //     },
  //   });

  //   if (!existingTask) {
  //     return { message: "Task not found", field: "all" };
  //   }

  //   // Update the task
  //   await db.task.update({
  //     where: {
  //       id: task.id,
  //     },
  //     data: {
  //       startTime: task.startTime,
  //       endTime: task.endTime,
  //       date: new Date(task.date!),
  //     },
  //   });
  // } else {
  //   const newTask = await db.task.create({
  //     data: {
  //       title: task.title,
  //       type: task.type!,
  //       startTime: task.startTime,
  //       endTime: task.endTime,
  //       date: task.date && new Date(task.date!),
  //       userId: parseInt(session.user.id),
  //       companyId: session.user.companyId,
  //     },
  //   });

  //   // Loop the assigned users and add them to the Google Calendar
  //   for (const user of task.assignedUsers) {
  //     const assignedUser = await db.user.findUnique({
  //       where: {
  //         id: user,
  //       },
  //     });

  //     // TODO: Add the task to the user's Google Calendar

  //     // Create the task user
  //     await db.taskUser.create({
  //       data: {
  //         taskId: newTask.id,
  //         userId: user,
  //         eventId: "null-for-now",
  //       },
  //     });
  //   }
  // }

  revalidatePath("/task");

  return true;
}
