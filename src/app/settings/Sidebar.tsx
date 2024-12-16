"use client";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Props = {};

const accountSettings = [
  {
    link: "/settings/my-account",
    label: "My Account",
  },
  {
    link: "/settings/business",
    label: "Business Profile",
  },
  {
    link: "/settings/networks",
    label: "My Network",
  },
  {
    link: "/settings/notifications",
    label: "Notifications",
  },
  {
    link: "/settings/billing",
    label: "Billing",
  },
];
const businessSettings = [
  {
    link: "/settings/team-management",
    label: "Team Managements",
  },
  {
    link: "/settings/payments",
    label: "Payments",
  },
  {
    link: "/settings/estimates",
    label: "Estimates & Invoice",
  },
  {
    link: "/settings/communications",
    label: "Communications Hub",
  },
  {
    link: "/settings/security",
    label: "Security",
  },
];

const Sidebar = (props: Props) => {
  const path = usePathname();
  return (
    <div className="sticky top-6 min-h-[85vh] min-w-[300px] max-w-[350px] rounded-2xl bg-white px-6 py-8 shadow-xl">
      <h3 className="mb-4 font-bold">
        <span className="border-b-2 pb-1">Account Settings</span>
      </h3>
      <div className="mb-8 space-y-2">
        {accountSettings.map((setting, index) => {
          return (
            <Link
              className={cn(
                "block px-4 py-2 hover:bg-gray-100 hover:text-gray-900",
                {
                  "font-medium text-[#6571FF]": path === setting.link,
                },
              )}
              key={index}
              href={setting.link}
            >
              {setting.label}
            </Link>
          );
        })}
      </div>
      <h3 className="mb-4 font-bold">
        <span className="border-b-2 pb-1">Business Settings</span>
      </h3>
      <div className="space-y-2">
        {businessSettings.map((setting, index) => {
          return (
            <Link
              className={cn(
                "block px-4 py-2 hover:bg-gray-100 hover:text-gray-900",
                {
                  "font-medium text-[#6571FF]": path === setting.link,
                },
              )}
              key={index}
              href={setting.link}
            >
              {setting.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
