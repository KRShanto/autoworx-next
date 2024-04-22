import Day from "./Day";
import Week from "./Week";
import Month from "./Month";
import { CalendarType } from "@/types/calendar";
import { Task, User } from "@prisma/client";

export default function Body({
  type,
  taskWithAssignedUsers,
  companyUsers,
}: {
  type: CalendarType;
  taskWithAssignedUsers: (Task & { assignedUsers: User[] })[];
  companyUsers: User[];
}) {
  if (type === "day")
    return <Day tasks={taskWithAssignedUsers} companyUsers={companyUsers} />;
  if (type === "week")
    return <Week tasks={taskWithAssignedUsers} companyUsers={companyUsers} />;
  if (type === "month") return <Month tasks={taskWithAssignedUsers} />;
}
