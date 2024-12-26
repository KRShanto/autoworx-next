import { TErrorHandler } from "@/types/globalError";
import { create } from "zustand";

interface FormErrorState {
  error: TErrorHandler | null;
  showError: (error: TErrorHandler | null) => void;
  clearError: () => void;
}

export const useFormErrorStore = create<FormErrorState>((set) => ({
  error: null,
  showError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
