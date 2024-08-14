import { create } from "zustand";

interface EstimateFilterState {
  dateRange: [Date | null, Date | null];
  status: string;
  search: string;
  setFilter({
    dateRange,
    status,
    search,
  }: {
    dateRange?: [Date | null, Date | null];
    status?: string;
    search?: string;
  }): void;
}

export const useEstimateFilterStore = create<EstimateFilterState>((set) => ({
  dateRange: [null, null],
  status: "",
  search: "",
  setFilter: ({ dateRange, status, search }) =>
    set((state) => ({
      dateRange,
      status,
      search,
    })),
}));
