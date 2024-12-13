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

/**
 * Creates a new task and assigns it to users.
 *
 * @param task - The task data to create.
 * @returns A server action indicating success or error.
 */
export async function createTask(task: TaskType): Promise<ServerAction> {
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

    // Create the new task in the database
    let newTask = await db.task.create({
      data: taskData,
    });

    // Loop through the assigned users and add them to the Google Calendar
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

    // If the task has date, start time and end time, then insert it in Google Calendar
    // Also need to check if Google Calendar token exists or not, if not, then no need of inserting
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (googleCalendarToken && task.startTime && task.endTime && task.date) {
      let event = await createGoogleCalendarEvent(task);

      // If event is successfully created in Google Calendar, then save the event ID in task model
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
