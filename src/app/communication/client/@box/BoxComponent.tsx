"use client";

import { Client, ClientSMS } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSms } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import { Conversation } from "../utils/types";
import Email from "./Email";
import SMS from "./SMS";

export default function BoxComponent({
  conversations,
  allSms,
  clientId,
  client,
}: {
  conversations: Conversation[];
  allSms: ClientSMS[];
  clientId: number;
  client: Client;
}) {
  const [selected, setSelected] = useState<"SMS" | "EMAIL" | "PHONE">("EMAIL");
  const [conversationState, setConversationState] =
    useState<Conversation[]>(conversations);

  useEffect(() => {
    setConversationState(conversations);
  }, [conversations]);

  return (
    <div className="app-shadow h-[83vh] w-[25%] rounded-lg bg-white">
      {/* Header */}
      <h2 className="h-[10%] rounded-t-lg border p-3 text-[14px] text-[#797979] 2xl:h-[5%]">
        Client Message
      </h2>

      {/* Chat Header */}
      <div className="flex h-[15%] items-center justify-between gap-2 rounded-md bg-[#006D77] p-2 text-white 2xl:h-[10%]">
        <div className="flex items-center">
          <Image
            src={
              !client?.photo
                ? "/images/default.png"
                : client.photo.includes("/images/default.png")
                  ? "/images/default.png"
                  : client.photo
            }
            alt="client"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="ml-4 flex flex-col">
            <p className="text-[14px] font-bold">
              {client?.firstName} {client?.lastName}
            </p>
            <p className="text-[8px]">{client?.customerCompany}</p>
          </div>
        </div>

        <div className="mr-5 flex items-center">
          <button
            onClick={() => setSelected("EMAIL")}
            className="rounded-full p-3"
            style={{
              backgroundColor:
                selected === "EMAIL" ? "rgba(255, 255, 255, 0.34)" : "",
            }}
          >
            <MdAlternateEmail className="text-xl text-white" />
            {/* <Image src="/icons/Chat.png" alt="chat" width={20} height={20} /> */}
          </button>

          <button
            onClick={() => setSelected("SMS")}
            className="rounded-full p-3"
            style={{
              backgroundColor:
                selected === "SMS" ? "rgba(255, 255, 255, 0.34)" : "",
            }}
          >
            <FaSms className="text-xl text-white" />
            {/* <Image src="/icons/Email.png" alt="chat" width={20} height={20} /> */}
          </button>

          <button
            onClick={() => setSelected("PHONE")}
            className="rounded-full p-3"
            style={{
              backgroundColor:
                selected === "PHONE" ? "rgba(255, 255, 255, 0.34)" : "",
            }}
          >
            <IoCall className="text-xl text-white" />
            {/* <Image src="/icons/Phone.png" alt="phone" width={20} height={20} /> */}
          </button>
        </div>
      </div>

      {selected === "EMAIL" && (
        <Email
          clientId={clientId}
          conversations={conversationState}
          setConversations={setConversationState}
        />
      )}
      {selected === "SMS" && <SMS clientId={clientId} allSms={allSms} />}
    </div>
  );
}
