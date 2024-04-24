import Heading from "./Heading";
import Body from "./Body";
import { Task } from "@prisma/client";

export default async function CalendarSidebar({
  usersWithTasks,
  tasks,
  tags,
}: {
  usersWithTasks: any;
  tasks: Task[];
  tags: string[];
}) {
  return (
    <div className="ml-5 mt-5 w-[270px]">
      <Heading />
      <Body usersWithTasks={usersWithTasks} tasks={tasks} tags={tags} />
    </div>
  );
}
