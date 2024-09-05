"use client";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { getTextSpace } from "@/lib/getTextSpace";
import NotificationTableRow from "./NotificationTableRow";
import useNotification from "@/hooks/useNotification";

type Props = {
  serviceKey: string;
};

const NotificationServiceContainer = ({ serviceKey }: Props) => {
  //@ts-ignore
  const { openService, setOpenService, notificationState } = useNotification();
  const serviceTitle = getTextSpace(serviceKey);
  const featureItems: any = notificationState[serviceKey];
  const featuresKeys = Object.keys(featureItems || ({} as Object));

  const handleServiceToggle = () => {
    const closeService = Object.keys(notificationState).reduce(
      (acc: any, cur: any) => {
        if (cur === serviceKey) {
          return { ...acc, [cur]: !openService[serviceKey] };
        } else {
          return { ...acc, [cur]: false };
        }
      },
      {},
    );
    setOpenService(closeService);
  };
  return (
    <div>
      <div
        className="flex w-full cursor-pointer items-center justify-between border p-8 font-semibold"
        onClick={handleServiceToggle}
      >
        <span className="capitalize">{serviceTitle}</span>
        <button>
          <IoIosArrowDown />
        </button>
      </div>
      {openService[serviceKey] && (
        <div className="w-full border p-8">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <td></td>
                <td className="text-sm font-semibold">Email</td>
                <td className="text-sm font-semibold">Push</td>
                <td className="text-sm font-semibold">Silence</td>
              </tr>
            </thead>
            <tbody>
              {featuresKeys.map((featureKey) => (
                <NotificationTableRow
                  key={featureKey}
                  serviceKey={serviceKey}
                  featureKey={featureKey}
                  featureItem={featureItems[featureKey]}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotificationServiceContainer;
