import { create } from "zustand";

interface ClientFilterState {
  search: string;
  setFilter({ search }: { search?: string }): void;
}

export const useClientFilterStore = create<ClientFilterState>((set) => ({
  search: "",
  setFilter: ({ search }) =>
    set((state) => ({
      search: search ?? state.search,
    })),
}));
