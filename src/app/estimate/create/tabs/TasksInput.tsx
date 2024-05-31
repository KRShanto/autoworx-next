"use client";

import { deleteTask } from "@/app/task/[type]/actions/deleteTask";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { create } from "mutative";
import { HiOutlinePlusCircle, HiXCircle } from "react-icons/hi2";

export function TasksInput() {
  const tasks = useEstimateCreateStore((x) => x.tasks);

  return (
    <div className="rounded border border-solid border-slate-500">
      <div className="aspect-[2/1] space-y-2 overflow-y-auto p-4">
        {tasks.map((task, i) => (
          <label key={i} className="relative block">
            <input
              value={task.task}
              onChange={(event) =>
                useEstimateCreateStore.setState((x) =>
                  create(x, (x) => {
                    x.tasks[i] = {
                      id: task.id,
                      task: event.currentTarget.value,
                    };
                  }),
                )
              }
              className="block w-full rounded border border-solid border-slate-500 px-2 py-1"
              placeholder="Task Name: Task Description"
            />
            <button
              type="button"
              onClick={async () => {
                useEstimateCreateStore.setState(({ tasks }) => ({
                  tasks: tasks.toSpliced(i, 1),
                }));
                task.id && (await deleteTask(task.id));
              }}
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 text-[#6470FF]"
            >
              <HiXCircle />
            </button>
          </label>
        ))}
        <button
          type="button"
          onClick={() => {
            useEstimateCreateStore.setState(({ tasks }) => ({
              tasks: [...tasks, { id: undefined, task: "" }],
            }));
          }}
          className="flex items-center gap-1 text-[#6571FF]"
        >
          <HiOutlinePlusCircle size="1.2em" />
          Task
        </button>
      </div>
    </div>
  );
}
