"use client";

import { tempClients } from "@/lib/tempClients";
import Image from "next/image";
import { useState } from "react";
import Email from "./Email";
import Messages from "./Messages";

export default function MessageBox({ conversations }: any) {
  const user = tempClients[0];
  const [selected, setSelected] = useState<"MESSAGES" | "EMAILS" | "PHONE">(
    "MESSAGES",
  );

  return (
    <div className="app-shadow h-[83vh] w-[25%] rounded-lg bg-white">
      {/* Header */}
      <h2 className="h-[10%] border p-3 text-[14px] text-[#797979] 2xl:h-[5%]">
        Client Message
      </h2>

      {/* Chat Header */}
      <div className="flex h-[15%] items-center justify-between gap-2 rounded-md bg-[#006D77] p-2 text-white 2xl:h-[10%]">
        <div className="flex items-center">
          <Image
            src={user.image}
            alt="user"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-[14px] font-bold">{user.name}</p>
            <p className="text-[8px]">{user.company}</p>
          </div>
        </div>

        <div className="mr-5 flex items-center">
          <button
            onClick={() => setSelected("MESSAGES")}
            className="rounded-full p-3"
            style={{
              backgroundColor:
                selected === "MESSAGES" ? "rgba(255, 255, 255, 0.34)" : "",
            }}
          >
            <Image src="/icons/Chat.png" alt="chat" width={20} height={20} />
          </button>

          <button
            onClick={() => setSelected("EMAILS")}
            className="rounded-full p-3"
            style={{
              backgroundColor:
                selected === "EMAILS" ? "rgba(255, 255, 255, 0.34)" : "",
            }}
          >
            <Image src="/icons/Email.png" alt="chat" width={20} height={20} />
          </button>

          <button
            onClick={() => setSelected("PHONE")}
            className="rounded-full p-3"
            style={{
              backgroundColor:
                selected === "PHONE" ? "rgba(255, 255, 255, 0.34)" : "",
            }}
          >
            <Image src="/icons/Phone.png" alt="phone" width={20} height={20} />
          </button>
        </div>
      </div>

      {selected === "MESSAGES" && <Messages conversations={conversations} />}
      {selected === "EMAILS" && <Email />}
    </div>
  );
}
