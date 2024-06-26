import { FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { Message, MessageQue } from "./UsersArea";

export default function MessageBox({
  user,
  setUsersList,
  messages,
  setMessages,
}: {
  user: any; // TODO: type this
  setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<MessageQue[]>>;
}) {
  const [message, setMessage] = useState("");
  const messageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!message) return;

    const res = await fetch("/api/pusher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: user.id,
        message,
      }),
    });

    const json = await res.json();

    if (json.success) {
      const newMessage: Message = {
        message,
        sender: "USER",
      };

      setMessages((messages) => {
        const newMessages = messages.map((m) => {
          if (m.user === user.id) {
            return {
              user: user.id,
              messages: [...m.messages, newMessage],
            };
          }

          return m;
        });

        return newMessages;
      });

      setMessage("");
    }
  }

  return (
    <div className="app-shadow h-[40vh] w-[18%] overflow-hidden rounded-lg border bg-white max-[1400px]:w-[40%]">
      {/* Chat Header */}
      <div className="flex h-[10%] items-center justify-between gap-2 rounded-md bg-[#006D77] p-2 text-white">
        <div className="flex items-center gap-1">
          <Image
            src={user.image}
            alt="user"
            width={25}
            height={25}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-[10px] font-bold">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Image src="/icons/Email.png" alt="email" width={10} height={10} />
          <Image src="/icons/Phone.png" alt="phone" width={10} height={10} />
          <FaTimes
            className="cursor-pointer text-sm"
            onClick={() => {
              setUsersList((usersList) =>
                usersList.filter((u) => u.id !== user.id),
              );
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="h-[82%] overflow-y-scroll" ref={messageBoxRef}>
        {messages.map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex items-center p-1 ${
              message.sender === "CLIENT" ? "justify-start" : "justify-end"
            }`}
          >
            <div className="flex items-center gap-2 p-1">
              <p
                className={cn(
                  "max-w-[220px] rounded-xl p-2 text-[10px]",
                  message.sender === "CLIENT"
                    ? "bg-[#D9D9D9] text-slate-800"
                    : "bg-[#006D77] text-white",
                )}
              >
                {message.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        className="flex h-[8%] items-center gap-2 bg-[#D9D9D9] p-2"
        onSubmit={handleSubmit}
      >
        <Image
          src="/icons/Attachment.svg"
          width={15}
          height={15}
          alt="attachment"
        />
        <input
          type="text"
          placeholder="Send Message..."
          className="h-5 w-full rounded-md border-none px-1 py-0 text-[8px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="">
          <Image src="/icons/Send.svg" width={20} height={20} alt="send" />
        </button>
      </form>
    </div>
  );
}
