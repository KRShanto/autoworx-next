"use client";
import { createContext } from "react";
export const NotificationContext = createContext<{
  notificationState: any;
  setNotificationState: React.Dispatch<React.SetStateAction<any>>;
  openService: any;
  setOpenService: React.Dispatch<React.SetStateAction<any>>;
} | null>(null);
