"use client";
import { Switch } from "@/components/Switch";
import useNotification from "@/hooks/useNotification";
import { getTextSpace } from "@/lib/getTextSpace";
import { cloneDeep } from "lodash";

type TProps = {
  serviceKey: string;
  featureKey: string;
  featureItem: Record<string, unknown>;
};
export default function NotificationTableRow({
  featureItem,
  serviceKey,
  featureKey,
}: TProps) {
  const featureTitle = getTextSpace(featureKey);
  const switchesBtnKeys = Object.keys(featureItem);
  //@ts-ignore
  const { notificationState, setNotificationState } = useNotification();

  const handleChecked = (value: boolean, switchKey: string) => {
    const updateNotification = {
      ...notificationState,
      [serviceKey]: {
        ...notificationState[serviceKey],
        [featureKey]: {
          ...notificationState[serviceKey][featureKey],
          [switchKey]: value,
        },
      },
    };
    setNotificationState(updateNotification);
  };
  return (
    <tr className="">
      <td className="capitalize">{featureTitle}</td>
      {switchesBtnKeys.map((switchKey) => (
        <td key={switchKey}>
          <Switch
            checked={featureItem[switchKey] as boolean}
            setChecked={(value) => handleChecked(value, switchKey)}
          />
        </td>
      ))}
    </tr>
  );
}
