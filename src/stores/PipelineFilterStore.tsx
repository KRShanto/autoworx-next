import { create } from "zustand";

interface pipelineFilterType {
  dateRange: [Date | null, Date | null];
  status: string;
  service: string;
  setFilter({
    dateRange,
    status,
    service,
  }: {
    dateRange?: [Date | null, Date | null];
    status?: string | null;
    service?: string | null;
  }): void;
}

export const usePipelineFilterStore = create<pipelineFilterType>((set) => ({
  dateRange: [null, null],
  status: "",
  service: "",
  setFilter: ({ dateRange, status, service }) =>
    set((state) => ({
      dateRange: dateRange ?? state.dateRange,
      status: status ?? state.status,
      service: service ?? state.service,
    })),
}));
