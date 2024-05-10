import { EmailTemplate } from "@/types/db";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useEmailTemplateStore = create(
  combine({ templates: [] as EmailTemplate[] }, (set) => ({
    setTemplates: (templates: EmailTemplate[]) => set({ templates }),
  })),
);
