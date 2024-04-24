import { create } from "zustand";

interface CalendarSidebarStore {
  type: "USERS" | "TASKS";
  setType: (calenderType: "USERS" | "TASKS") => void;
}

export const useCalendarSidebarStore = create<CalendarSidebarStore>((set) => ({
  type: "USERS",
  setType: (type) => set({ type }),
}));
