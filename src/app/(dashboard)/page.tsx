import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { auth } from "../auth";
import DashboardAdmin from "./DashboardAdmin";
import DashboardManager from "./DashboardManager";
import DashboardOther from "./DashboardOther";
import DashboardSales from "./DashboardSales";
import DashboardTechnician from "./DashboardTechnician";

let dashboard_view = ["ADMIN", "OTHER", "SALES", "TECHNICIAN"];

export default async function Page() {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const tasks = await db.task.findMany({
    where: {
      companyId,
    },
  });
  const companyUsers = await db.user.findMany({
    where: {
      companyId,
    },
  });

  const calendarAppointments = [];

  // Get all appointments
  const appointments = await db.appointment.findMany({
    where: {
      companyId,
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

  return (
    <>
      {/* <DashboardOther
      tasks={tasks}
      companyUsers={companyUsers}
      appointments={calendarAppointments}
    /> */}

      {/* <DashboardTechnician
      tasks={tasks}
      companyUsers={companyUsers}
      appointments={calendarAppointments}
    /> */}

      <DashboardSales
        tasks={tasks}
        companyUsers={companyUsers}
        appointments={calendarAppointments}
      />

      {/* <DashboardManager
        tasks={tasks}
        companyUsers={companyUsers}
        appointments={calendarAppointments}
      /> */}

      {/* <DashboardAdmin
        tasks={tasks}
        companyUsers={companyUsers}
        appointments={calendarAppointments}
      /> */}
    </>
  );
}
