import { create } from "zustand";

interface EmployeeWorkFilterState {
  dateRange: [Date | null, Date | null];
  amount: [number, number];
  search: string;
  setFilter({
    dateRange,
    amount,
    search,
  }: {
    dateRange?: [Date | null, Date | null];
    amount?: [number, number];
    search?: string;
  }): void;
}

export const useEmployeeWorkFilterStore = create<EmployeeWorkFilterState>(
  (set) => ({
    dateRange: [null, null],
    amount: [1, 30000], // TODO
    search: "",
    setFilter: ({ dateRange, amount, search }) =>
      set((state) => ({
        dateRange: dateRange || state.dateRange,
        amount: amount || state.amount,
        search: search || "",
      })),
  }),
);
