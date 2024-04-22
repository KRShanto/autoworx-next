import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "../../../../stores/popup";
import { FaPlus } from "react-icons/fa";
import { Task, User } from "@prisma/client";
import TaskComponent from "./Task";

export default function Tasks({
  tasks,
  users,
}: {
  tasks: Task[];
  users: User[];
}) {
  const { open } = usePopupStore();

  return (
    <div className="app-shadow relative mt-5 h-[93%] rounded-[12px] bg-white p-3">
      <h2 className="text-[19px] text-black">Task List</h2>

      <div className="mt-3 flex max-h-[92%] flex-wrap gap-3 overflow-y-auto">
        {tasks.map((task) => (
          <TaskComponent key={task.id} task={task} />
        ))}

        <button
          className="rounded-full bg-[#797979] px-14 py-2 text-[17px] text-white max-[1300px]:px-2 max-[1300px]:py-1 max-[1300px]:text-[14px]"
          onClick={() =>
            open("ADD_TASK", {
              companyUsers: users,
            })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}
