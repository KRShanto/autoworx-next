import { create } from "zustand";

interface EmployeeWorkFilterState {
  dateRange: [Date | null, Date | null];
  amount: [number, number];
  search: string;
  service: string;
  category: string;
  setFilter({
    dateRange,
    amount,
    search,
    service,
    category,
  }: {
    dateRange?: [Date | null, Date | null];
    amount?: [number, number];
    search?: string;
    service?: string;
    category?: string;
  }): void;
}

export const useEmployeeWorkFilterStore = create<EmployeeWorkFilterState>(
  (set) => ({
    dateRange: [null, null],
    amount: [1, 30000], // TODO
    search: "",
    service: "",
    category: "",
    setFilter: ({ dateRange, amount, search, service, category }) =>
      set((state) => ({
        dateRange: dateRange || state.dateRange,
        amount: amount || state.amount,
        search: search || "",
        service: service,
        category: category,
      })),
  }),
);
