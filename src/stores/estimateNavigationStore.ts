import { create } from "zustand";

type NavigationStore = {
  type: "invoice" | "estimate" | null;
  setType: (type: "invoice" | "estimate") => void;
  resetType: () => void;
};

export const useEstimateNavigationStore = create<NavigationStore>((set) => ({
  type: null,
  setType: (type) => set({ type }),
  resetType: () => set({ type: null }),
}));
