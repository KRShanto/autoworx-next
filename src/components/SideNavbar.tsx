"use client";

import Link from "next/link";
import Image from "next/image";
import { act, ReactNode, useEffect, useState } from "react";
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

type TProps = {
  navList: {
    title: string;
    icon: string;
    link?: string | null;
    subnav?:
      | {
          title: string;
          link: string;
        }[]
      | null;
  }[];
};

export default function SideNavbar({ navList }: TProps) {
  const pathName = usePathname();
  const [visibleTooltip, setVisibleTooltip] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  return (
    <TooltipProvider delayDuration={200}>
      <nav className="fixed z-10 hidden h-screen flex-col items-center gap-8 overflow-y-auto bg-[#0C1427] px-2 py-12 sm:flex lg:w-[5%]">
        {/* logo */}
        <Link href="/">
          <Image
            src="/icons/Logo.png"
            alt="Company Logo"
            width={40}
            height={40}
          />
        </Link>

        {/* Links */}
        <div className="mb-auto mt-16 flex flex-col items-center gap-4">
          {navList.map((item, index) =>
            item.subnav ? (
              <Dropdown
                key={index}
                title={item.title}
                index={index}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                icon={
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={20}
                    height={20}
                  />
                }
              >
                {activeDropdown === index &&
                  item?.subnav?.map((subnavItem, index) => (
                    <DropdownMenuItem
                      key={index}
                      asChild
                      className="cursor-pointer border border-solid border-white bg-white shadow-lg hover:bg-slate-500/80 hover:text-white focus:bg-slate-500/80 focus:text-white"
                    >
                      <Link href={subnavItem.link}>{subnavItem.title}</Link>
                    </DropdownMenuItem>
                  ))}
              </Dropdown>
            ) : (
              <Tooltip key={index}>
                <TooltipTrigger
                  asChild
                  onMouseEnter={() => setVisibleTooltip(index)}
                  onMouseLeave={() => setVisibleTooltip(null)}
                >
                  {item.link && (
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
                  )}
                </TooltipTrigger>
                {visibleTooltip === index && (
                  <TooltipContent
                    side="right"
                    sideOffset={8}
                    className="border border-solid border-white bg-slate-500/80 text-white"
                  >
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            ),
          )}
        </div>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/settings/my-account" className="hover:opacity-50">
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
  index,
  activeDropdown,
  setActiveDropdown,
  children,
}: {
  title: string;
  icon: ReactNode;
  index: number;
  activeDropdown: number | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<number | null>>;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [toolTip, setTooltip] = useState(false);
  const [visibleTooltip, setVisibleTooltip] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveDropdown(index);
    }
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip open={!open && toolTip} onOpenChange={setTooltip}>
        <TooltipTrigger
          asChild
          onMouseEnter={() => setVisibleTooltip(true)}
          onMouseLeave={() => setVisibleTooltip(false)}
        >
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "rounded-sm p-2 hover:bg-white/25",
                open && activeDropdown === index && "!bg-black invert",
              )}
            >
              {icon}
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        {visibleTooltip && (
          <TooltipContent
            side="right"
            sideOffset={8}
            className="border border-solid border-white bg-slate-500/80 text-white"
          >
            {title}
          </TooltipContent>
        )}
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
