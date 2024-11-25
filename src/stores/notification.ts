import { create } from "zustand";
import { TNotification, TOpenService } from "@/types/notification";

interface NotificationStore {
  notificationState: TNotification | null;
  setNotificationState: (notification: TNotification | null) => void;
  openService: TOpenService | null;
  setOpenService: (openService: TOpenService | null) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notificationState: null,
  setNotificationState: (notificationState) => set({ notificationState }),
  openService: null,
  setOpenService: (openService) => set({ openService }),
}));
