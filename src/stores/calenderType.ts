import { create } from "zustand";

interface CalenderTypeStore {
  calenderType: "DAY" | "WEEK" | "MONTH";
  setCalenderType: (calenderType: "DAY" | "WEEK" | "MONTH") => void;
}

export const useCalenderTypeStore = create<CalenderTypeStore>((set) => ({
  calenderType: "DAY",
  setCalenderType: (calenderType) => set({ calenderType }),
}));
