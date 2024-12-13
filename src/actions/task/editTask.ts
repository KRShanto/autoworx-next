"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { Priority } from "@prisma/client";
import { google } from "googleapis";
import { env } from "next-runtime-env";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AppointmentToAdd } from "../appointment/addAppointment";
import { AppointmentToUpdate } from "../appointment/editAppointment";

import createGoogleCalendarEvent from "./google-calendar/createGoogleCalendarEvent";
import updateGoogleCalendarEvent from "./google-calendar/updateGoogleCalendarEvent";

interface TaskType {
  title: string;
  description: string;
  assignedUsers: number[];
  priority: Priority;
  startTime?: string;
  endTime?: string;
  date?: string;
  timezone: string;
}

/**
 * Edits an existing task.
 *
 * @param id - The ID of the task to edit.
 * @param task - The updated task data.
 * @returns A server action indicating success or error.
 */
export async function editTask({
  id,
  task,
}: {
  id: number;
  task: TaskType;
}): Promise<ServerAction> {
  try {
    // Find the task users
    const taskUsers = await db.taskUser.findMany({
      where: {
        taskId: id,
      },
    });

    const assignedUsers = task.assignedUsers;

    // Find the difference between the existing users and the new users
    const toRemove = taskUsers.filter(
      (taskUser) => !assignedUsers?.includes(taskUser.userId),
    );
    const toAdd = assignedUsers?.filter(
      (userId) => !taskUsers.find((taskUser) => taskUser.userId === userId),
    );

    // Remove the users
    for (const user of toRemove) {
      // TODO: Remove the task from the user's Google Calendar

      await db.taskUser.delete({
        where: {
          id: user.id,
        },
      });
    }

    if (Array.isArray(toAdd)) {
      // Add the users
      for (const user of toAdd) {
        // TODO: Add the task to the user's Google Calendar

        // Create the task user
        await db.taskUser.create({
          data: {
            taskId: id,
            userId: user,
            eventId: "null-for-now",
          },
        });
      }
    }

    // Update the task
    let updatedTask = await db.task.update({
      where: {
        id,
      },
      data: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        startTime: task.startTime,
        endTime: task.endTime,
        date: task.date,
      },
    });

    // If the task has date, start time and end time, then insert it in Google Calendar
    // Also need to check if Google Calendar token exists or not, if not, then no need of inserting
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (
      googleCalendarToken &&
      updatedTask.googleEventId &&
      updatedTask.startTime &&
      updatedTask.endTime &&
      updatedTask.date
    ) {
      await updateGoogleCalendarEvent(updatedTask.googleEventId, task);
    } else if (
      googleCalendarToken &&
      !updatedTask.googleEventId &&
      updatedTask.startTime &&
      updatedTask.endTime &&
      updatedTask.date
    ) {
      let event = await createGoogleCalendarEvent(task);

      // If event is successfully created in Google Calendar, then save the event ID in task model
      if (event && event.id) {
        await db.task.update({
          where: {
            id: updatedTask.id,
          },
          data: {
            googleEventId: event.id,
          },
        });
      }
    }

    revalidatePath("/task");
    revalidatePath("/communication/client");

    return {
      type: "success",
    };
  } catch (error) {
    console.log("🚀 ~ error updating:", error);
    return {
      type: "error",
    };
  }
}
