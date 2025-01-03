import { getLastClockInOutForUser } from "@/actions/dashboard/clockIn";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { User } from "@prisma/client";
import DashboardAdmin from ".//DashboardAdmin";
import DashboardManager from "./DashboardManager";
import DashboardOther from "./DashboardOther";
import DashboardSales from "./DashboardSales";
import DashboardTechnician from "./DashboardTechnician";
import { planObject } from "@/utils/planObject";

export default async function Dashboard() {
  const user = await getUser();
  let tasks;
  if (user.employeeType == "Admin" || user.employeeType == "Manager") {
    // tasks = await db.task.findMany({
    //   where: {
    //     companyId: user.companyId,
    //   },
    // });
    tasks = await db.task.findMany({
      where: {
        companyId: user.companyId,
        OR: [
          {
            taskUser: {
              some: {
                userId: +user.id,
              },
            },
          },
          { userId: +user.id },
        ],
      },
    });
  } else {
    tasks = await db.task.findMany({
      where: {
        companyId: user.companyId,
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

  const companyUsers = await db.user.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  // fetching all the leave requests
  let pendingLeaveRequests = await db.leaveRequest.findMany({
    where: {
      companyId: user.companyId,
      status: "Pending",
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let filteredLeaveRequests = [];

  // if current user is Manager, then he should not be shown leave requests of other Managers
  // only Admin can approve Manager's leave requests
  if (user.employeeType === "Manager") {
    for (const leaveRequest of pendingLeaveRequests) {
      if (leaveRequest.user.employeeType !== "Manager") {
        filteredLeaveRequests.push(leaveRequest);
      }
    }
  } else {
    filteredLeaveRequests = pendingLeaveRequests;
  }

  const calendarAppointments = [];

  // Get all appointments
  const appointments = await db.appointment.findMany({
    where: {
      companyId: user.companyId,
    },
  });

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


  if (user.employeeType === "Admin") {
    return (
      <DashboardAdmin
        tasks={taskWithAssignedUsers}
        companyUsers={planObject(companyUsers)}
        appointments={calendarAppointments}
        pendingLeaveRequests={filteredLeaveRequests}
      />
    );
  } else if (user.employeeType === "Manager") {
    return (
      <DashboardManager
        tasks={taskWithAssignedUsers}
        companyUsers={planObject(companyUsers)}
        appointments={calendarAppointments}
        pendingLeaveRequests={filteredLeaveRequests}
      />
    );
  } else if (user.employeeType === "Sales") {
    return (
      <DashboardSales
        tasks={taskWithAssignedUsers}
        companyUsers={planObject(companyUsers)}
        appointments={calendarAppointments}
      />
    );
  } else if (user.employeeType === "Technician") {
    let lastClockInOut = await getLastClockInOutForUser();

    return (
      <DashboardTechnician
        tasks={taskWithAssignedUsers}
        companyUsers={planObject(companyUsers)}
        appointments={calendarAppointments}
        lastClockInOut={lastClockInOut}
      />
    );
  } else if (user.employeeType === "Other") {
    let lastClockInOut = await getLastClockInOutForUser();

    return (
      <DashboardOther
        tasks={taskWithAssignedUsers}
        companyUsers={planObject(companyUsers)}
        appointments={calendarAppointments}
        lastClockInOut={lastClockInOut}
      />
    );
  }
}
