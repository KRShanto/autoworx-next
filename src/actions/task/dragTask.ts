"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import createGoogleCalendarEvent from "./google-calendar/createGoogleCalendarEvent";
import updateGoogleCalendarEvent from "./google-calendar/updateGoogleCalendarEvent";

type TTask = {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
};

/**
 * Updates the task date and time when dragged.
 *
 * @param task - The task data with updated date and time.
 * @returns A server action indicating success or error.
 */
export async function dragTask(task: TTask): Promise<ServerAction> {
  const oldTask = await db.task.findUnique({
    where: {
      id: task.id,
    },
  });

  await db.task.update({
    where: {
      id: task.id,
    },
    data: {
      date: new Date(task.date),
      startTime: oldTask?.startTime || task.startTime,
      endTime: oldTask?.endTime || task.endTime,
    },
  });

  revalidatePath("/task");

  return {
    type: "success",
  };
}

/**
 * Updates the task with new date and time, and syncs with Google Calendar.
 *
 * @param task - The task data with updated date and time.
 * @returns A server action indicating success or error.
 */
export async function updateTask(task: TTask): Promise<ServerAction> {
  try {
    let updatedTask = await db.task.update({
      where: {
        id: task.id,
      },
      data: {
        date: new Date(task?.date).toISOString(),
        startTime: task?.startTime,
        endTime: task?.endTime,
      },
    });

    revalidatePath("/task");

    // If the task has date, start time and end time, then insert it in Google Calendar
    // Also need to check if Google Calendar token exists or not, if not, then no need of inserting
    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (
      googleCalendarToken &&
      updatedTask.googleEventId &&
      updatedTask.startTime &&
      updatedTask.endTime &&
      updatedTask.date &&
      updatedTask.title &&
      updatedTask.description
    ) {
      let taskForGoogleCalendar = {
        title: updatedTask.title,
        description: updatedTask.description,
        assignedUsers: [],
        priority: updatedTask.priority,
        startTime: updatedTask.startTime,
        endTime: updatedTask.endTime,
        date: new Date(updatedTask.date).toISOString(),
        timezone: task.timezone,
      };

      await updateGoogleCalendarEvent(
        updatedTask.googleEventId,
        taskForGoogleCalendar,
      );
    } else if (
      googleCalendarToken &&
      !updatedTask.googleEventId &&
      updatedTask.startTime &&
      updatedTask.endTime &&
      updatedTask.date &&
      updatedTask.title &&
      updatedTask.description
    ) {
      let taskForGoogleCalendar = {
        title: updatedTask.title,
        description: updatedTask.description,
        assignedUsers: [],
        priority: updatedTask.priority,
        startTime: updatedTask.startTime,
        endTime: updatedTask.endTime,
        date: new Date(updatedTask.date).toISOString(),
        timezone: task.timezone,
      };

      let event = await createGoogleCalendarEvent(taskForGoogleCalendar);

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

    return {
      type: "success",
    };
  } catch (error) {
    return {
      type: "error",
    };
  }
}
