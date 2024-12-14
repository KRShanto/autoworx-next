import { create } from "zustand";

interface ActionState {
  actionType: "create" | "edit";
  setActionType: (actionType: "create" | "edit") => void;
}

export const useActionStoreCreateEdit = create<ActionState>((set) => ({
  actionType: "create",
  setActionType: (type) => set({ actionType: type }),
}));
