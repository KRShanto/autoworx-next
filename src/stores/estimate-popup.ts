import { create } from "zustand";

type PopupType = "SERVICE" | "MATERIAL" | "LABOR" | "TAG" | null;

export interface EstimatePopupStore {
  type: PopupType;
  data: any;
  close: () => void;
  open: (type: PopupType, data?: any) => void;
}

export const useEstimatePopupStore = create<EstimatePopupStore>((set) => ({
  type: null,
  data: null,
  close: () => {
    set({ type: null });
  },
  open: (type: PopupType, data?: any) => {
    set({ type, data });
  },
}));
