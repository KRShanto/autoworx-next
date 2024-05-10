import Day from "./Day";
import Week from "./Week";
import Month from "./Month";
import { CalendarType } from "@/types/calendar";
import {
  Appointment,
  CalendarSettings,
  Customer,
  Order,
  Task,
  User,
  Vehicle,
} from "@prisma/client";
import { AppointmentFull, CalendarAppointment, CalendarTask } from "@/types/db";
import { EmailTemplate } from "@/types/db";

export default function Body({
  type,
  tasks,
  companyUsers,
  tasksWithoutTime,
  appointments,
  appointmentsFull,
  customers,
  vehicles,
  orders,
  settings,
  templates,
}: {
  type: CalendarType;
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
  appointments: CalendarAppointment[];
  appointmentsFull: AppointmentFull[];
  customers: Customer[];
  vehicles: Vehicle[];
  orders: Order[];
  settings: CalendarSettings;
  templates: EmailTemplate[];
}) {
  if (type === "day")
    return (
      <Day
        tasks={tasks}
        companyUsers={companyUsers}
        vehicles={vehicles}
        orders={orders}
        settings={settings}
        templates={templates}
        customers={customers}
        tasksWithoutTime={tasksWithoutTime}
        appointments={appointments as any}
        appointmentsFull={appointmentsFull}
      />
    );
  if (type === "week")
    return (
      <Week
        tasks={tasks}
        companyUsers={companyUsers}
        tasksWithoutTime={tasksWithoutTime}
        appointments={appointments as any}
        appointmentsFull={appointmentsFull}
        customers={customers}
        vehicles={vehicles}
        orders={orders}
        settings={settings}
        templates={templates}
      />
    );
  if (type === "month")
    return (
      <Month
        tasks={tasks}
        companyUsers={companyUsers}
        tasksWithoutTime={tasksWithoutTime}
        appointments={appointments}
        appointmentsFull={appointmentsFull}
        customers={customers}
        vehicles={vehicles}
        orders={orders}
        settings={settings}
        templates={templates}
      />
    );
}
