import { create } from "zustand";

interface CalendarUserTypeStore {
  calendarUserType: "USERS" | "TASKS";
  setCalendarUserType: (calenderType: "USERS" | "TASKS") => void;
}

export const useCalendarUserTypeStore = create<CalendarUserTypeStore>(
  (set) => ({
    calendarUserType: "USERS",
    setCalendarUserType: (calendarUserType) => set({ calendarUserType }),
  })
);
