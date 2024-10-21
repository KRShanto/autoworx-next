"use client";
import { updateNotification } from "@/actions/settings/updateNotification";
import { Switch } from "@/components/Switch";
import useNotification from "@/hooks/useNotification";
import { getTextSpace } from "@/lib/getTextSpace";
import { useState, useTransition } from "react";
import MySwitch from "./MySwitch";
import { useNotificationStore } from "@/stores/notification";

type TProps = {
  serviceKey: string;
  featureKey: string;
  featureItem: Record<string, unknown> | undefined;
};
export default function NotificationTableRow({
  featureItem,
  serviceKey,
  featureKey,
}: TProps) {
  const featureTitle = getTextSpace(featureKey);
  const switchesBtnKeys = featureItem && Object.keys(featureItem);
  //@ts-ignore
  const { notificationState, setNotificationState } = useNotification();
  const [error, setError] = useState<string | null>(null);

  const handleChecked = async (value: boolean, switchKey: string) => {
    try {
      const updateNotificationSettings = {
        ...notificationState,
        [serviceKey]: {
          ...notificationState[serviceKey],
          [featureKey]: {
            ...notificationState[serviceKey][featureKey],
            [switchKey]: value,
          },
        },
      };
      const updatedNotificationSettingsFromDB = await updateNotification(
        updateNotificationSettings,
      );
      if (updatedNotificationSettingsFromDB.type === "success") {
        setError(null);
        setNotificationState(
          updatedNotificationSettingsFromDB.data.notifications,
        );
      } else {
        setError("Something went wrong");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  console.log({ error });
  return (
    <tr className="">
      <td className="capitalize">{featureTitle}</td>
      {featureItem &&
        switchesBtnKeys?.map((switchKey) => (
          <td key={switchKey}>
            <MySwitch
              checked={featureItem[switchKey] as boolean}
              onChecked={(value) => handleChecked(value, switchKey)}
            />
          </td>
        ))}
    </tr>
  );
}
