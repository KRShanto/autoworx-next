import Popup from "@/components/Popup";
import { usePopupStore } from "../../../../../stores/popup";
import { useState } from "react";
import FormError from "@/components/FormError";
import Image from "next/image";
import { Task, User } from "@prisma/client";
import Submit from "@/components/Submit";
import { assignTask } from "../../actions/assignTask";

export default function AssignTask() {
  const { data, close } = usePopupStore();
  const user = data.user as User & { tasks: Task[] };
  const tasks = data.tasks as Task[];

  const [taskDataInput, setTaskDataInput] = useState(
    tasks.map((task) => ({
      taskId: task.id,
      assigned: user.tasks.some((userTask) => userTask.id === task.id),
    })),
  );

  async function handleSubmit() {
    await assignTask({ userId: user.id, tasksToAssign: taskDataInput });
    close();
  }

  return (
    <Popup>
      <div className="w-[40rem] p-2 text-slate-600">
        <div>
          <h2 className="text-lg font-bold">Assign task for user</h2>

          <FormError />

          <div className="mt-1 flex items-center gap-2">
            <Image
              src={user.image}
              alt="User image"
              width={50}
              height={50}
              className="rounded-full"
            />
            <p className="text-xl font-bold">{user.name}</p>
          </div>

          <h2 className="mt-5 text-lg font-bold">Select tasks</h2>

          <form onSubmit={handleSubmit}>
            <div className="flex max-h-[15rem] flex-col gap-2 overflow-y-auto p-2 font-bold">
              {taskDataInput.map((task, i) => {
                return (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="tasks"
                      value={task.taskId}
                      checked={task.assigned}
                      onChange={(e) => {
                        setTaskDataInput((prev) =>
                          prev.map((prevTask, index) => {
                            if (index === i) {
                              return {
                                taskId: prevTask.taskId,
                                assigned: e.target.checked,
                              };
                            }
                            return prevTask;
                          }),
                        );
                      }}
                    />
                    <p className="text-lg">{tasks[i].title}</p>
                  </label>
                );
              })}
            </div>

            <div className="mt-5 flex justify-center gap-10">
              <Submit
                formAction={handleSubmit}
                className="rounded-md bg-blue-600 px-5 py-2 text-lg font-bold text-white"
              >
                Assign
              </Submit>

              <button
                type="button"
                className="ml-2 rounded-md bg-red-800 px-5 py-2 text-lg font-bold text-white"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Popup>
  );
}
