"use client";

import { TNotification, TOpenService } from "@/types/notification";
import { createContext } from "react";
export const NotificationContext = createContext<{
  notificationState: TNotification;
  setNotificationState: React.Dispatch<React.SetStateAction<TNotification>>;
  openService: TOpenService;
  setOpenService: React.Dispatch<React.SetStateAction<TOpenService>>;
} | null>(null);
