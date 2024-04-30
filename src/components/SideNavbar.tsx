"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navList = [
  {
    title: "Dashboard",
    icon: "/icons/navbar/Dashboard.svg",
    link: "/",
  },
  {
    title: "Communication Hub",
    icon: "/icons/navbar/Community.svg",
    subnav: [
      {
        title: "Client",
        link: "/communication/client/1",
      },
      {
        title: "Internal",
        link: "/communication/internal",
      },
      {
        title: "Collaboration",
        link: "/communication/collaboration",
      },
    ],
  },
  {
    title: "Sales and Funnel Management",
    icon: "/icons/navbar/Sales.svg",
    link: "/sales",
  },
  {
    title: "Task and Activity Management",
    icon: "/icons/navbar/Task.svg",
    link: "/task/day",
  },
  {
    title: "Analytics and Reporting",
    icon: "/icons/navbar/Analytics.svg",
    link: "/analytics",
  },
  {
    title: "Invoices",
    icon: "/icons/navbar/Invoices.svg",
    link: "/invoice",
  },
  {
    title: "Payments",
    icon: "/icons/navbar/Payments.svg",
    link: "/payments",
  },
  {
    title: "Inventory",
    icon: "/icons/navbar/Inventory.svg",
    subnav: [
      {
        title: "Service",
        link: "/inventory/service",
      },
    ],
  },
];

export default function SideNavbar() {
  const [openNav, setOpenNav] = useState<string | null>(null);

  return (
    <nav className="fixed flex h-screen w-[5%] flex-col items-center bg-[#0C1427] px-2 py-12">
      {/* logo */}
      <Image src="/icons/Logo.png" alt="Company Logo" width={40} height={40} />

      {/* Links */}
      <div className="mt-16 flex flex-col items-center gap-8">
        {navList.map((item, index) => {
          if (item.subnav) {
            return (
              <div key={index} className="relative">
                <button
                  className="hover:opacity-50"
                  onClick={() =>
                    setOpenNav(openNav === item.title ? null : item.title)
                  }
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={20}
                    height={20}
                  />
                </button>

                {openNav === item.title && (
                  <div className="relative top-0 flex flex-col gap-4">
                    {item.subnav.map((subnavItem, index) => (
                      <Link
                        key={index}
                        href={subnavItem.link}
                        className="hover:opacity-50"
                        title={subnavItem.title}
                      >
                        {/* ball */}
                        <div className="mx-auto mt-1 h-4 w-4 rounded-full bg-[white]"></div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              className="hover:opacity-50"
              key={index}
              href={item.link}
              title={item.title}
            >
              <Image src={item.icon} alt={item.title} width={20} height={20} />
            </Link>
          );
        })}
      </div>

      {/* Settings */}
      <Link
        href="/settings"
        className="mt-auto hover:opacity-50"
        title="Settings"
      >
        <Image
          src="/icons/navbar/Settings.svg"
          alt="Settings"
          width={20}
          height={20}
        />
      </Link>
    </nav>
  );
}
