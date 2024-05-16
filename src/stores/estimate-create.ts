import { create } from "zustand";

export const useEstimateCreateStore = create(() => ({
  items: [] as {
    service: string;
    material: string;
    labor: string;
    tags: string[];
  }[],
}));
