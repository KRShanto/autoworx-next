import { CalendarType } from "@/types/calendar";
import { AppointmentFull, CalendarAppointment, CalendarTask } from "@/types/db";
import type { EmailTemplate } from "@prisma/client";
import { CalendarSettings, Client, Task, User, Vehicle } from "@prisma/client";
import { Suspense } from "react";
import Body from "./Body";
import Heading from "./Heading";

export default function Calender({
  type,
  tasks,
  companyUsers,
  tasksWithoutTime,
  customers,
  vehicles,
  settings,
  appointments,
  appointmentsFull,
  templates,
  user,
}: {
  type: CalendarType;
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
  customers: Client[];
  vehicles: Vehicle[];
  settings: CalendarSettings;
  appointments: CalendarAppointment[];
  appointmentsFull: AppointmentFull[];
  templates: EmailTemplate[];
  user: User;
}) {
  return (
    <div className="app-shadow relative w-full overflow-hidden rounded-[18px] bg-white p-4">
      <Heading
        type={type as any}
        customers={customers}
        vehicles={vehicles}
        settings={settings}
        employees={companyUsers}
        templates={templates}
        user={user}
      />
      <Suspense>
        <Body
          type={type as any}
          tasks={tasks}
          companyUsers={companyUsers}
          tasksWithoutTime={tasksWithoutTime}
          appointments={appointments}
          appointmentsFull={appointmentsFull}
          customers={customers}
          vehicles={vehicles}
          settings={settings}
          templates={templates}
        />
      </Suspense>
    </div>
  );
}
