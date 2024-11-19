"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { AuthSession } from "@/types/auth";
import { Priority } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import createGoogleCalendarEvent from "./google-calendar/createGoogleCalendarEvent";

export interface TaskType {
  title: string;
  description: string;
  assignedUsers: number[];
  priority: Priority;
  invoiceId?: string;
  startTime?: string;
  endTime?: string;
  clientId?: number | null;
  date?: string;
  timezone?: string;
}

export async function createTask(task: TaskType): Promise<ServerAction> {
  console.log("🚀 ~ createTask ~ task:", task);
  try {
    const session = (await auth()) as AuthSession;
    let taskData = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      userId: parseInt(session.user.id),
      companyId: session.user.companyId,
      invoiceId: task.invoiceId,
      startTime: task.startTime,
      endTime: task.endTime,
      clientId: task.clientId,
      date: task?.date || undefined,
    };

    let newTask = await db.task.create({
      data: taskData,
    });

    // Loop the assigned users and add them to the Google Calendar
    for (const user of task.assignedUsers) {
      const assignedUser = await db.user.findUnique({
        where: {
          id: user,
        },
      });

      // TODO: Add the task to the user's Google Calendar

      // Create the task user
      await db.taskUser.create({
        data: {
          taskId: newTask.id,
          userId: user,
          eventId: "null-for-now",
        },
      });
    }

    revalidatePath("/task");
    revalidatePath("/communication/client");

    // if the task has date, start time and end time, then insert it in google calendar
    // also need to check if google calendar token exists or not, if not, then no need of inserting
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (googleCalendarToken && task.startTime && task.endTime && task.date) {
      let event = await createGoogleCalendarEvent(task);

      // if event is successfully created in google calendar, then save the event id in task model
      if (event && event.id) {
        newTask = await db.task.update({
          where: {
            id: newTask.id,
          },
          data: {
            googleEventId: event.id,
          },
        });
      }
    }

    return {
      type: "success",
      data: newTask,
    };
  } catch (error) {
    console.log("Error while creating new task", error);

    return {
      type: "error",
    };
  }
}
