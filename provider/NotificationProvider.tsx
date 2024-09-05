"use client";
import { NotificationContext } from "context";
import React, { useEffect, useState } from "react";
import { any } from "zod";

type TProps = {
  notification: any;
  children: React.ReactNode;
};

export default function NotificationProvider({
  notification,
  children,
}: TProps) {
  const [notificationState, setNotificationState] = useState(notification);
  const serviceKeys = Object.keys(notification);
  const [openService, setOpenService] = useState(
    serviceKeys.reduce((acc: any, cur: any) => {
      return { ...acc, [cur]: false };
    }, {}),
  );

  return (
    <NotificationContext.Provider
      value={{
        openService,
        setOpenService,
        notificationState,
        setNotificationState,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
