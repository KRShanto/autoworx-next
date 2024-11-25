import { create } from "zustand";

interface CalendarSidebarStore {
  type: "USERS" | "TASKS";
  minimized: boolean;
  setType: (calenderType: "USERS" | "TASKS") => void;
  toggleMinimized: () => void;
  setMinimized: (minimized: boolean) => void;
}

export const useCalendarSidebarStore = create<CalendarSidebarStore>((set) => ({
  type: "USERS",
  minimized: false,
  setType: (type) => set({ type }),
  toggleMinimized: () => set((state) => ({ minimized: !state.minimized })),
  setMinimized: (minimized) => set({ minimized }),
}));
