import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { auth } from "../auth";
import Dashboard from "./Dashboard";

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
  console.log("calendarAppointments", calendarAppointments);
  return <Dashboard tasks={tasks} companyUsers={companyUsers} appointments={calendarAppointments} />;
}
