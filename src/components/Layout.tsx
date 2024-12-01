"use client";

import { EmployeeType } from "@prisma/client";
import { Session } from "next-auth";
import { redirect, usePathname } from "next/navigation";
import MobileNav from "./mobile-responsive/MobileNav";
import PopupState from "./PopupState";
import PrivateRoute from "./PrivateRoute";
import SideNavbar from "./SideNavbar";
import TopNavbar from "./TopNavbar";

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
        link: "/communication/client",
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
    title: "Pipelines",
    icon: "/icons/navbar/Sales.svg",
    subnav: [
      {
        title: "Shop Pipeline",
        link: "/pipeline/shop",
      },
      {
        title: "Sales Pipeline",
        link: "/pipeline/sales",
      },
    ],
  },
  {
    title: "Task and Activity Management",
    icon: "/icons/navbar/Task.svg",
    link: "/task/day",
  },
  {
    title: "Analytics and Reporting",
    icon: "/icons/navbar/Analytics.svg",
    link: "/reporting/revenue",
  },
  {
    title: "Invoices",
    icon: "/icons/navbar/Invoices.svg",
    link: "/estimate",
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
        title: "Inventory List",
        link: "/inventory",
      },
      {
        title: "Vendor List",
        link: "/inventory/vendor",
      },
      {
        title: "Camera",
        link: "/inventory/camera",
      },
    ],
  },
  {
    title: "Directory",
    icon: "/icons/navbar/Employee.png",
    subnav: [
      {
        title: "Employee",
        link: "/employee",
      },
      {
        title: "Client",
        link: "/client",
      },
    ],
  },
];

export default function Layout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: (Session & { user: { employeeType: string } }) | null;
}) {
  const pathname = usePathname();

  // Check if the user is logged in
  if (
    !session &&
    pathname !== "/login" &&
    pathname !== "/register" &&
    pathname !== "/"
  )
    redirect("/login");

  // Don't show the navbar if the user is on the login or register page or in the home page but not logged in
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    (pathname === "/" && !session)
  )
    return <main>{children}</main>;

  return (
    <div className="w-full overflow-y-hidden">
      <SideNavbar navList={navList} />
      <MobileNav navList={navList} />
      <div className="sm:ml-[5%]">
        <TopNavbar />
        <PopupState />
        <main className="relative h-[93vh] overflow-y-auto bg-[#F8F9FA] sm:p-2 sm:px-4">
          <PrivateRoute session={session}>{children}</PrivateRoute>
        </main>
      </div>
    </div>
  );
}
