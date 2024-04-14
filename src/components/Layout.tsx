"use client";

import SideNavbar from "./SideNavbar";
import TopNavbar from "./TopNavbar";
import PopupState from "./PopupState";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show the navbar if the user is on the login or register page
  if (pathname === "/login" || pathname === "/register")
    return (
      <main className="relative h-[93vh] bg-[#F8F9FA] p-2 px-7">
        {children}
      </main>
    );

  return (
    <div>
      <SideNavbar />
      <div className="ml-[20%]">
        <TopNavbar />
        <PopupState />

        <main className="relative h-[93vh] bg-[#F8F9FA] p-2 px-7">
          {children}
        </main>
      </div>
    </div>
  );
}
