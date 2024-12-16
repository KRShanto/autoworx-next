"use client";
import DnDWrapper from "@/components/DnDWrapper";
import { CalendarType } from "@/types/calendar";
import { AppointmentFull, CalendarAppointment } from "@/types/db";
import type { EmailTemplate, Holiday } from "@prisma/client";
import { CalendarSettings, Client, Task, User, Vehicle } from "@prisma/client";
import Calendar from "./Calendar/Calendar";
import CalendarSidebar from "./CalendarSidebar/CalendarSidebar";

export default function TaskPage({
  type,
  taskWithAssignedUsers,
  companyUsers,
  usersWithTasks,
  customers,
  vehicles,
  settings,
  appointments,
  templates,
  appointmentsFull,
  holidays,
  user,
}: {
  type: CalendarType;
  taskWithAssignedUsers: (Task & { assignedUsers: User[] })[];
  companyUsers: User[];
  holidays: Holiday[];
  usersWithTasks: any; // TODO: Fix this type
  customers: Client[];
  vehicles: Vehicle[];
  settings: CalendarSettings;
  appointments: CalendarAppointment[];
  templates: EmailTemplate[];
  appointmentsFull: AppointmentFull[];
  user: User;
}) {
  // Filter the tasks where startTime, endTime, and date are not null
  const calendarTasks = taskWithAssignedUsers.filter(
    (task) => task.startTime && task.endTime && task.date,
  );
  // Filter the tasks without startTime, endTime, and date
  const tasksWithoutTime = taskWithAssignedUsers.filter(
    (task) => !task.startTime && !task.endTime,
  );

  return (
    <DnDWrapper id="task">
      <CalendarSidebar
        usersWithTasks={usersWithTasks}
        tasks={tasksWithoutTime.concat(calendarTasks)}
      />
      <Calendar
        type={type}
        tasks={calendarTasks as any}
        tasksWithoutTime={tasksWithoutTime}
        companyUsers={companyUsers}
        customers={customers}
        vehicles={vehicles}
        settings={settings}
        appointments={appointments}
        holidays={holidays}
        templates={templates}
        appointmentsFull={appointmentsFull}
        user={user}
      />
    </DnDWrapper>
  );
}
