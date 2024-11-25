"use client";
import { NotificationContext } from "context";
import { useContext } from "react";

export default function useNotification() {
  return useContext(NotificationContext);
}
