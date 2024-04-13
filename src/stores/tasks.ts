import { create } from "zustand";
import { TaskType } from "@/types/task";

interface TaskStore {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
