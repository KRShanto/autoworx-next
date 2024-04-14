"use client";

import { cn } from "../lib/cn";
import { NAV_LINKS, NavItem, SUB_NAV_LINKS } from "../lib/consts";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SideNavbar() {
  const pathname = usePathname();

  // Get last path from url
  // const lastPath = "/" + window.location.pathname.split("/").pop(); // TODO: improve this
  const lastPath = "/" + pathname.split("/").pop();

  // State for subNavItems
  const [isOpen, setIsOpen] = useState(ifAnySubItemActive());

  // Check if item is active
  function ifItemActive(item: NavItem) {
    return "/" + item.path?.split("/").pop() === lastPath;
  }

  // Check if any subItem is active
  function ifAnySubItemActive() {
    return SUB_NAV_LINKS.some((navItem) => ifItemActive(navItem));
  }

  useEffect(() => {
    setIsOpen(ifAnySubItemActive());
  }, [pathname]);

  return (
    <nav className="fixed h-screen w-[20%] bg-[#0C1427] px-10 py-12">
      <div className="flex items-center justify-between gap-3">
        {/* logo */}
        <Image
          src="/icons/Logo.svg"
          alt="Company Logo"
          width={200}
          height={20}
          className="w-[200px] max-[1516px]:w-[180px] max-[1394px]:w-[150px] max-[1248px]:w-[120px]"
        />

        {/* hamburger menu */}
        <div className="flex flex-col gap-[6px]">
          <div className="h-[2px] w-6 bg-white max-[1516px]:h-[1px] max-[1516px]:w-5 max-[1248px]:w-4"></div>
          <div className="h-[2px] w-6 bg-white max-[1516px]:h-[1px] max-[1516px]:w-5 max-[1248px]:w-4"></div>
          <div className="h-[2px] w-6 bg-white max-[1516px]:h-[1px] max-[1516px]:w-5 max-[1248px]:w-4"></div>
        </div>
      </div>

      <p className="mt-16 text-[12px] font-bold uppercase text-white">Main</p>

      {/* nav items */}
      <div className="mt-4 flex flex-col gap-4">
        {NAV_LINKS.map((navItem) => (
          <div key={navItem.name}>
            {/* If navItem has subItems */}
            {navItem.subItems ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  {/* Square */}
                  <div
                    className={cn(
                      "h-[10px] w-[10px] rotate-45 border-2 max-[1500px]:h-[8px] max-[1500px]:w-[8px]",
                      ifAnySubItemActive()
                        ? "border-[#6571FF]"
                        : "border-[#66738C]",
                    )}
                  ></div>
                  {/* Text */}
                  <p
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                      "cursor-pointer select-none text-[14px] max-[1500px]:text-[12px]",
                      ifAnySubItemActive()
                        ? "text-[#6571FF]"
                        : "text-[#66738C]",
                    )}
                  >
                    {navItem.name}
                  </p>
                </div>

                {/* subItems */}
                <div
                  className={cn(
                    "flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "mt-4 max-h-[100px]" : "max-h-0",
                  )}
                >
                  {navItem.subItems?.map((subItem) => (
                    <div className="flex items-center gap-4" key={subItem.name}>
                      {/* Circle */}
                      <div
                        className={cn(
                          "h-[4px] w-[4px] rounded-full",
                          ifItemActive(subItem)
                            ? "bg-[#6571FF]"
                            : "bg-[#66738C]",
                        )}
                      ></div>

                      {/* Text/Link */}
                      <Link
                        href={subItem.path!}
                        className={cn(
                          "cursor-pointer text-[14px] max-[1500px]:text-[12px]",
                          ifItemActive(subItem)
                            ? "text-[#6571FF]"
                            : "text-[#66738C]",
                        )}
                      >
                        {subItem.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // If navItem has no subItems
              <div className="flex items-center gap-4">
                {/* Square */}
                <div
                  className={cn(
                    "h-[10px] w-[10px] rotate-45 border-2 max-[1500px]:h-[8px] max-[1500px]:w-[8px]",
                    ifItemActive(navItem)
                      ? "border-[#6571FF]"
                      : "border-[#66738C]",
                  )}
                ></div>

                {/* Text/Link */}
                <Link
                  href={navItem.path!}
                  className={cn(
                    "cursor-pointer select-none text-[14px] max-[1500px]:text-[12px]",
                    ifItemActive(navItem) ? "text-[#6571FF]" : "text-[#66738C]",
                  )}
                >
                  {navItem.name}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
