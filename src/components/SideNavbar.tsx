"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";

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
];

export default function SideNavbar() {
  const [openNav, setOpenNav] = useState<string | null>(null);
  const pathName = usePathname();

  return (
    <TooltipProvider delayDuration={500}>
      <nav className="fixed z-10 flex h-screen w-[5%] flex-col items-center gap-8 overflow-y-auto bg-[#0C1427] px-2 py-12">
        {/* logo */}
        <Image
          src="/icons/Logo.png"
          alt="Company Logo"
          width={40}
          height={40}
        />

        {/* Links */}
        <div className="mb-auto mt-16 flex flex-col items-center gap-4">
          {navList.map((item, index) =>
            item.subnav ? (
              <Dropdown
                key={index}
                title={item.title}
                icon={
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={20}
                    height={20}
                  />
                }
              >
                {item.subnav.map((subnavItem, index) => (
                  <DropdownMenuItem
                    key={index}
                    asChild
                    className="border border-solid border-white bg-white shadow-lg hover:bg-slate-500/80 hover:text-white focus:bg-slate-500/80 focus:text-white"
                  >
                    <Link href={subnavItem.link}>{subnavItem.title}</Link>
                  </DropdownMenuItem>
                ))}
              </Dropdown>
            ) : (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    className={cn(
                      "rounded-sm p-2 hover:bg-white/25",
                      pathName === item.link && "!bg-black invert",
                    )}
                    href={item.link}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={20}
                      height={20}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                  className="border border-solid border-white bg-slate-500/80 text-white"
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            ),
          )}
        </div>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/settings" className="hover:opacity-50">
              <Image
                src="/icons/navbar/Settings.svg"
                alt="Settings"
                width={20}
                height={20}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={8}
            className="border border-solid border-white bg-slate-500/80 text-white"
          >
            Settings
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}

function Dropdown({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [toolTip, setTooltip] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip open={!open && toolTip} onOpenChange={setTooltip}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "rounded-sm p-2 hover:bg-white/25",
                open && "!bg-black invert",
              )}
            >
              {icon}
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={8}
          className="border border-solid border-white bg-slate-500/80 text-white"
        >
          {title}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={8}
        className="-m-4 space-y-1 border-none bg-transparent p-4 shadow-none"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
