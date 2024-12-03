"use client";
import { signOut } from "next-auth/react";
import { env } from "next-runtime-env";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoMdLogOut, IoMdNotificationsOutline } from "react-icons/io";
import { IoChatbubblesOutline, IoNotificationsOutline } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { MdOutlineNotifications } from "react-icons/md";
import NewUserFeedback from "./NewUserFeedback";

export default function TopNavbarIcons() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-x-6">
      <NewUserFeedback />
      <button className="bg-white text-[1.7rem] font-bold text-[#6571FF]">
        <MdOutlineNotifications />
      </button>
      <button className="bg-white text-[1.7rem] font-bold text-[#6571FF]">
        <HiOutlineChatBubbleLeftRight />
      </button>
      <button className="bg-white text-[1.7rem] font-bold text-[#6571FF]">
        <LuUser2 />
      </button>

      <button
        onClick={() => {
          signOut({
            redirect: false,
          });
          router.push(
            env("NEXT_PUBLIC_APP_URL")
              ? env("NEXT_PUBLIC_APP_URL") + "/"
              : "https://autoworx.link/",
          );
        }}
        className="bg-white text-[1.7rem] font-bold text-[#6571FF]"
      >
        <IoMdLogOut />
      </button>
    </div>
  );
}
