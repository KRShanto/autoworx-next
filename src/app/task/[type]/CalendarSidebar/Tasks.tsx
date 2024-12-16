import { cn } from "@/lib/cn";
import { useCalendarSidebarStore } from "@/stores/calendarSidebar";
import { Task, User } from "@prisma/client";
import NewTask from "../components/task/NewTask";
import { MinimizeButton } from "./MinimiseButton";
import TaskComponent from "./Task";

export default function Tasks({
  tasks,
  users,
}: {
  tasks: Task[];
  users: User[];
}) {
  const minimized = useCalendarSidebarStore((x) => x.minimized);
  return (
    <div
      className={cn(
        "app-shadow relative mt-5 flex flex-grow flex-col gap-2 overflow-hidden rounded-[12px] bg-white",
        minimized || "p-3",
      )}
    >
      <h2 className="flex items-center justify-between">
        {!minimized && <div className="text-[19px] text-black">Task List</div>}
        <MinimizeButton />
      </h2>

      {!minimized && (
        <div className="space-y-2 overflow-y-auto">
          {tasks.map((task) => (
            <TaskComponent key={task.id} task={task} />
          ))}
        </div>
      )}
      {!minimized && (
        <div className="mt-auto">
          <NewTask companyUsers={users} />
        </div>
      )}
    </div>
  );
}
