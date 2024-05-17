import { Labor, Material, Service, Tag } from "@prisma/client";
import { create } from "zustand";

export const useEstimateCreateStore = create(() => ({
  items: [] as {
    id: string; // nanoid
    service: Service | null;
    material: Material | null;
    labor: Labor | null;
    tags: Tag[] | null;
  }[],
}));
