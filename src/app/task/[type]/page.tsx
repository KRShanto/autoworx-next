import { auth } from "@/app/auth";
import { SyncLists } from "@/components/SyncLists";
import Title from "@/components/Title";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { CalendarType } from "@/types/calendar";
import { AppointmentFull } from "@/types/db";
import { CalendarSettings, User } from "@prisma/client";
import moment from "moment";
import { Metadata } from "next";
import TaskPage from "./TaskPage";

export const metadata: Metadata = {
  title: "Task and Activity Management",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { type: string };
  searchParams: { month: string };
}) {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  let user = (await db.user.findFirst({
    where: {
      id: +session.user.id,
    },
  })) as User;
  const calendarAppointments = [];
  let appointments;
  let tasks;

  // get selected month
  const getMonth = searchParams.month
    ? moment(searchParams.month, "YYYY-MM").format("MMMM")
    : moment().format("MMMM");

  // get selected year
  const getYear = searchParams.month
    ? moment(searchParams.month, "YYYY-MM").year()
    : moment().year();

  const holidays = await db.holiday.findMany({
    where: {
      companyId: companyId,
      month: getMonth,
      year: getYear,
    },
  });

  if (user.employeeType == "Admin" || user.employeeType == "Manager") {
    // only admin and manager can see all appointments
    appointments = await db.appointment.findMany({
      where: {
        companyId,
      },
    });
    // Get all the tasks for the company
    // where startTime, endTime, and date are not null
    tasks = await db.task.findMany({
      where: {
        companyId,
      },
    });
  } else {
    // else, only show appointments for the assigned user
    appointments = await db.appointment.findMany({
      where: {
        companyId,
        appointmentUsers: {
          some: {
            userId: +user.id,
          },
        },
      },
    });

    tasks = await db.task.findMany({
      where: {
        companyId,
        OR: [
          {
            taskUser: {
              some: {
                userId: +user.id,
              },
            },
          },
          {
            userId: +user.id,
          },
        ],
      },
    });
  }

  // aggregating assigned users data
  for (const appointment of appointments) {
    const appointmentUsers = await db.appointmentUser.findMany({
      where: { appointmentId: appointment.id },
    });

    const users = await db.user.findMany({
      where: {
        id: {
          in: appointmentUsers.map((appointmentUser) => appointmentUser.userId),
        },
      },
    });

    const client = appointment.clientId
      ? await db.client.findUnique({
          where: { id: appointment.clientId },
        })
      : null;

    calendarAppointments.push({
      ...appointment,
      assignedUsers: users,
      client,
    });
  }

  // Tasks with assigned users
  // Here we will store both the task and the assigned users
  const taskWithAssignedUsers = [];

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
      companyId,
    },
  });

  const usersWithTasks = [];

  const users = await db.user.findMany({
    where: {
      companyId,
      role: "employee",
    },
  });

  for (const user of users) {
    const taskUsers = await db.taskUser.findMany({
      where: { userId: user.id },
    });

    const tasks = await db.task.findMany({
      where: {
        id: {
          in: taskUsers.map((taskUser) => taskUser.taskId),
        },
        companyId,
      },
    });
    console.log("🚀 ~ tasks:", tasks);

    usersWithTasks.push({
      ...user,
      tasks,
    });
  }

  const customers = await db.client.findMany({
    where: { companyId },
  });

  const vehicles = await db.vehicle.findMany({
    where: { companyId },
  });

  const settings = (await db.calendarSettings.findFirst({
    where: {
      companyId,
    },
  })) as CalendarSettings;

  const emailTemplates = await db.emailTemplate.findMany({
    where: {
      companyId,
    },
  });

  let appointmentsFull: AppointmentFull[] = [];

  for (const appointment of appointments) {
    const client = appointment.clientId
      ? await db.client.findUnique({
          where: { id: appointment.clientId },
        })
      : null;

    const vehicle = appointment.vehicleId
      ? await db.vehicle.findUnique({
          where: { id: appointment.vehicleId },
        })
      : null;

    const confirmationEmailTemplate = appointment.confirmationEmailTemplateId
      ? await db.emailTemplate.findUnique({
          where: { id: appointment.confirmationEmailTemplateId },
        })
      : null;

    const reminderEmailTemplate = appointment.reminderEmailTemplateId
      ? await db.emailTemplate.findUnique({
          where: { id: appointment.reminderEmailTemplateId },
        })
      : null;

    const appointmentUsers = await db.appointmentUser.findMany({
      where: { appointmentId: appointment.id },
    });

    const assignedUsers = await db.user.findMany({
      where: {
        id: {
          in: appointmentUsers.map((appointmentUser) => appointmentUser.userId),
        },
      },
    });

    appointmentsFull.push({
      ...appointment,
      times: appointment.times as string[],
      client,
      vehicle,
      confirmationEmailTemplate: confirmationEmailTemplate as any,
      reminderEmailTemplate: reminderEmailTemplate as any,
      assignedUsers,
    });
  }
  const estimates = await db.invoice.findMany({
    where: {
      type: "Estimate",
    },
  });

  return (
    <>
      <Title>Task and Activity Management</Title>

      <div id="task" className="relative flex h-[81vh] gap-4 pt-4">
        <SyncLists
          customers={customers}
          vehicles={vehicles}
          employees={companyUsers}
          templates={emailTemplates}
          estimates={estimates}
        />
        <TaskPage
          type={params.type as CalendarType}
          taskWithAssignedUsers={taskWithAssignedUsers}
          companyUsers={companyUsers}
          usersWithTasks={usersWithTasks}
          customers={customers}
          vehicles={vehicles}
          settings={settings}
          holidays={holidays}
          appointments={calendarAppointments!}
          templates={emailTemplates}
          appointmentsFull={appointmentsFull}
          user={user}
        />
      </div>
    </>
  );
}
