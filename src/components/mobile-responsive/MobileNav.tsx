"use client";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import MobileNavList from "./MobileNavList";

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

export default function MobileNav({ navList }: TProps) {
  const [openNav, setOpenNav] = useState(false);
  return (
    <div className="sm:hidden">
      <div className="flex h-[46px] items-center bg-[#0C1427] p-1.5">
        <div
          onClick={() => setOpenNav((prev) => !prev)}
          className="flex-shrink-0"
        >
          <HiOutlineBars3 size={30} className="text-white" />
        </div>
        <div className="flex w-full items-center justify-center">
          <Link href="/">
            <Image
              src="/icons/Logo.png"
              alt="Company Logo"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
      {/* nav sidebar */}
      <div
        className={cn(
          "w-0 bg-[#0C1427] duration-300",
          openNav && "fixed top-0 h-svh w-full duration-300",
        )}
        style={{ zIndex: 999 }}
      >
        {openNav && (
          <div className="p-5">
            <div className="flex justify-center">
              <Image
                src={"/icons/navbar/mobile-nav-logo.svg"}
                alt={"company logo"}
                width={275}
                height={275}
              />
            </div>
            <ul className="mt-10 flex flex-col items-center justify-center gap-y-8">
              {navList.map((item, index) => {
                return (
                  <MobileNavList
                    key={index}
                    item={item}
                    setOpenNav={setOpenNav}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
