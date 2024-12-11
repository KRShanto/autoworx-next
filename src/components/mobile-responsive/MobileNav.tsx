"use client";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineBars3, HiXCircle } from "react-icons/hi2";
import MobileNavList from "./MobileNavList";
import { useRouter } from "next/navigation";
import { env } from "next-runtime-env";
import { signOut } from "next-auth/react";

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
  const router = useRouter();
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
          <div className="flex flex-col p-5">
            <div className="flex justify-center">
              <Image
                src={"/icons/navbar/mobile-nav-logo.svg"}
                alt={"company logo"}
                width={275}
                height={275}
                className="mt-7"
              />
              <button
                onClick={() => setOpenNav(false)}
                className="absolute right-5 top-5 text-2xl text-white hover:text-gray-400"
              >
                <HiXCircle size={30} />
              </button>
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
            <button
              className="mx-auto mt-20 w-[120px] rounded-full border-2 py-2 text-xl text-white"
              onClick={() => {
                signOut({
                  redirect: false,
                });
                router.push(
                  env("NEXT_PUBLIC_APP_URL")
                    ? env("NEXT_PUBLIC_APP_URL") + "/login"
                    : "https://autoworx.link/login",
                );
                setOpenNav(false);
              }}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
