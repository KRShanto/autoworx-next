import Heading from "./Heading";
import Body from "./Body";
import { db } from "@/lib/db";
import { Task } from "@prisma/client";

export default async function CalendarUser({
  usersWithTasks,
  tasks,
}: {
  usersWithTasks: any;
  tasks: Task[];
}) {
  console.log("Task from calendar user: ", tasks);
  return (
    <div className="ml-5 mt-5 w-[270px]">
      <Heading />
      <Body usersWithTasks={usersWithTasks} tasks={tasks} />
    </div>
  );
}
