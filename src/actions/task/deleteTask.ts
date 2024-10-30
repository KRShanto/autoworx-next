"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import deleteGoogleCalendarEvent from "./google-calendar/deleteGoogleCalendarEvent";

export async function deleteTask(id: number): Promise<ServerAction> {
  try {
    // find the task users
    const taskUsers = await db.taskUser.findMany({
      where: {
        taskId: id,
      },
    });

    // remove the task users
    for (const user of taskUsers) {
      // TODO: Remove the task from the user's Google Calendar
    }

    // remove the task
    let deletedTask = await db.task.delete({
      where: {
        id,
      },
    });

    // delete task from google calendar

    const cookie = await cookies();
    let googleCalendarToken = cookie.get("googleCalendarToken")?.value;

    if (googleCalendarToken && deletedTask.googleEventId) {
      await deleteGoogleCalendarEvent(deletedTask.googleEventId);
    }

    revalidatePath("/task");
    revalidatePath("/communication/client");

    return {
      type: "success",
    };
  } catch (error) {
    console.log("🚀 ~ deleteTask ~ error:", error);
    return {
      type: "error",
    };
  }
}
