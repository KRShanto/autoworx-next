import { CalendarType } from "@/types/calendar";
import Body from "./Body";
import Heading from "./Heading";
import { Task, User } from "@prisma/client";

export default function Calender({
  type,
  taskWithAssignedUsers,
  companyUsers,
}: {
  type: CalendarType;
  taskWithAssignedUsers: (Task & { assignedUsers: User[] })[];
  companyUsers: User[];
}) {
  return (
    <div className="app-shadow relative mt-4 h-[98%] w-[1150px] overflow-hidden rounded-[18px] bg-white p-4">
      <Heading type={type as any} />
      <Body
        type={type as any}
        taskWithAssignedUsers={taskWithAssignedUsers}
        companyUsers={companyUsers}
      />
    </div>
  );
}
