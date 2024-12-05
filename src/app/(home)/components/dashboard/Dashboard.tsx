import { getLastClockBreakForUser } from "@/actions/dashboard/break";
import { getLastClockInOutForUser } from "@/actions/dashboard/clockIn";
import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { AuthSession } from "@/types/auth";
import DashboardAdmin from ".//DashboardAdmin";
import DashboardManager from "./DashboardManager";
import DashboardOther from "./DashboardOther";
import DashboardSales from "./DashboardSales";
import DashboardTechnician from "./DashboardTechnician";

export default async function Dashboard() {
  const user = await getUser();

  const tasks = await db.task.findMany({
    where: {
      companyId: user.companyId,
    },
  });

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
        tasks={tasks}
        companyUsers={companyUsers}
        appointments={calendarAppointments}
        pendingLeaveRequests={filteredLeaveRequests}
      />
    );
  } else if (user.employeeType === "Manager") {
    return (
      <DashboardManager
        tasks={tasks}
        companyUsers={companyUsers}
        appointments={calendarAppointments}
        pendingLeaveRequests={filteredLeaveRequests}
      />
    );
  } else if (user.employeeType === "Sales") {
    let tasks = await db.task.findMany({
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

    return (
      <DashboardSales
        tasks={tasks}
        companyUsers={companyUsers}
        appointments={calendarAppointments}
      />
    );
  } else if (user.employeeType === "Technician") {
    let lastClockInOut = await getLastClockInOutForUser();
    let tasks = await db.task.findMany({
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
    return (
      <DashboardTechnician
        tasks={tasks}
        companyUsers={companyUsers}
        appointments={calendarAppointments}
        lastClockInOut={lastClockInOut}
      />
    );
  } else if (user.employeeType === "Other") {
    let lastClockInOut = await getLastClockInOutForUser();
    let tasks = await db.task.findMany({
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
    
    return (
      <DashboardOther
        tasks={tasks}
        companyUsers={companyUsers}
        appointments={calendarAppointments}
        lastClockInOut={lastClockInOut}
      />
    );
  }
}
