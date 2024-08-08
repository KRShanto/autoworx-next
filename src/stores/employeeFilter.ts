import { create } from "zustand";

export type EmployeeType = "Sales" | "Technician" | "All";

interface EmployeeFilterState {
  dateRange: [Date | null, Date | null];
  type: EmployeeType;
  search: string;
  setFilter({
    dateRange,
    type,
    search,
  }: {
    dateRange?: [Date | null, Date | null];
    type?: EmployeeType;
    search?: string;
  }): void;
}

export const useEmployeeFilterStore = create<EmployeeFilterState>((set) => ({
  dateRange: [null, null],
  type: "All",
  search: "",
  setFilter: ({ dateRange, type, search }) =>
    set((state) => ({
      dateRange: dateRange || state.dateRange,
      type: type || state.type,
      search: search || "",
    })),
}));
