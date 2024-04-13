import { create } from "zustand";
import { PopupType } from "@/types/popup";

interface PopupState {
  // Which popup is open
  popup: PopupType;
  // Data to pass to the popup
  data: any;
  // Open a popup
  open: (popup: PopupType, data?: any) => void;
  // Close the popup.
  close: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  popup: null,
  data: {},
  open: (popup, data: any = {}) => set({ popup, data }),
  close: () => set({ popup: null, data: null }),
}));
