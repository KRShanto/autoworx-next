import Heading from "./Heading";
import Body from "./Body";
import { db } from "@/lib/db";

export default async function CalendarUser() {
  const usersWithTasks = [];

  const users = await db.user.findMany();

  for (const user of users) {
    const taskUsers = await db.taskUser.findMany({
      where: { userId: user.id },
    });

    const tasks = await db.task.findMany({
      where: {
        id: {
          in: taskUsers.map((taskUser) => taskUser.taskId),
        },
      },
    });

    usersWithTasks.push({
      ...user,
      tasks,
    });
  }

  const tasks = await db.task.findMany();

  return (
    <div className="ml-5 mt-5 w-[270px]">
      <Heading />
      <Body usersWithTasks={usersWithTasks} tasks={tasks} />
    </div>
  );
}
