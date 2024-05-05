"use client";

import SideNavbar from "./SideNavbar";
import TopNavbar from "./TopNavbar";
import PopupState from "./PopupState";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default function Layout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();

  // Check if the user is logged in
  if (!session && pathname !== "/login" && pathname !== "/register")
    redirect("/login");

  // Don't show the navbar if the user is on the login or register page
  if (pathname === "/login" || pathname === "/register")
    return (
      <main className="relative h-[93vh] bg-[#F8F9FA] p-2 px-4">
        {children}
      </main>
    );

  return (
    <div>
      <SideNavbar />
      <div className="ml-[5%]">
        <TopNavbar />
        <PopupState />

        <main className="relative h-[93vh] bg-[#F8F9FA] p-2 px-4">
          {children}
        </main>
      </div>
    </div>
  );
}
