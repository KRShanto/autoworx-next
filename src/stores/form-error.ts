import { FormErrorType } from "@/types/form-errror";
import { create } from "zustand";

interface FormErrorState {
  error: FormErrorType | null;
  showError: (error: FormErrorType | null) => void;
  clearError: () => void;
}

export const useFormErrorStore = create<FormErrorState>((set) => ({
  error: null,
  showError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
