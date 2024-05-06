import Day from "./Day";
import Week from "./Week";
import Month from "./Month";
import { CalendarType } from "@/types/calendar";
import { Appointment, Task, User } from "@prisma/client";
import { CalendarAppointment, CalendarTask } from "@/types/db";

export default function Body({
  type,
  tasks,
  companyUsers,
  tasksWithoutTime,
  appointments,
}: {
  type: CalendarType;
  tasks: CalendarTask[];
  companyUsers: User[];
  tasksWithoutTime: Task[];
  appointments: CalendarAppointment[];
}) {
  if (type === "day")
    return (
      <Day
        tasks={tasks}
        companyUsers={companyUsers}
        tasksWithoutTime={tasksWithoutTime}
        appointments={appointments as any}
      />
    );
  if (type === "week")
    return (
      <Week
        tasks={tasks}
        companyUsers={companyUsers}
        tasksWithoutTime={tasksWithoutTime}
        appointments={appointments as any}
      />
    );
  if (type === "month")
    return (
      <Month
        tasks={tasks}
        companyUsers={companyUsers}
        tasksWithoutTime={tasksWithoutTime}
        appointments={appointments}
      />
    );
}
