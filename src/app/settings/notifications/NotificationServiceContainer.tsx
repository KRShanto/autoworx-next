"use client";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { getTextSpace } from "@/lib/getTextSpace";
import NotificationTableRow from "./NotificationTableRow";
import useNotification from "@/hooks/useNotification";
import {
  TNotification,
  TOpenService,
  TSwitchValue,
} from "@/types/notification";

type Props = {
  serviceKey: string;
};

const NotificationServiceContainer = ({ serviceKey }: Props) => {
  const { openService, setOpenService, notificationState } =
    useNotification() || {};
  const serviceTitle = getTextSpace(serviceKey);
  const featureItems =
    notificationState && notificationState[serviceKey as keyof TNotification];
  const featuresKeys = featureItems && Object.keys(featureItems);

  const handleServiceToggle = () => {
    const closeService = Object.keys(notificationState!).reduce(
      (acc: any, cur: any) => {
        if (cur === serviceKey) {
          return {
            ...acc,
            [cur]: !openService?.[serviceKey as keyof TNotification],
          };
        } else {
          return { ...acc, [cur]: false };
        }
      },
      {},
    );
    setOpenService && setOpenService(closeService);
  };
  return (
    <div className="w-2/4">
      <div
        className="flex w-full cursor-pointer items-center justify-between border p-8 font-semibold"
        onClick={handleServiceToggle}
      >
        <span className="capitalize">{serviceTitle}</span>
        <button>
          <IoIosArrowDown />
        </button>
      </div>
      {openService?.[serviceKey as keyof TOpenService] && (
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
              {featuresKeys &&
                featuresKeys?.map((featureKey) => (
                  <NotificationTableRow
                    key={featureKey}
                    serviceKey={serviceKey}
                    featureKey={featureKey}
                    featureItem={
                      featureItems[featureKey as keyof typeof featureItems]
                    }
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
