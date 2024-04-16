import Image from "next/image";
import { cn } from "@/lib/cn";
import Attachment from "@/../public/icons/Attachment.svg";
import Send from "@/../public/icons/Send.svg";

export default function Messages({ user }: { user: any }) {
  const messages = [
    {
      id: 1,
      message: "Hello",
      sender: "client",
    },
    {
      id: 2,
      message: "Hello there. How are you? I am fine. What about you?",
      sender: "user",
    },
    {
      id: 3,
      message: "I am fine. Thanks for asking. What about you?",
      sender: "client",
    },
    {
      id: 4,
      message: "I am fine. Thanks for asking. What about you?",
      sender: "client",
    },
    {
      id: 5,
      message: "I am fine. Thanks for asking. What about you?",
      sender: "client",
    },
    {
      id: 6,
      message: "Hello there. How are you? I am fine. What about you?",
      sender: "user",
    },

    {
      id: 7,
      message: "I am fine. Thanks for asking. What about you?",
      sender: "client",
    },
    {
      id: 8,
      message: "Hello there. How are you? I am fine. What about you?",
      sender: "user",
    },

    {
      id: 9,
      message: "I am fine. Thanks for asking. What about you?",
      sender: "client",
    },
  ];

  return (
    <>
      <div className="h-[80%] overflow-y-scroll">
        {messages.map((message: any, index: number) => (
          <div
            key={message.id}
            className={`flex items-center p-1 ${
              message.sender === "client" ? "justify-start" : "justify-end"
            }`}
          >
            <div className="flex items-center gap-2 p-1">
              {message.sender === "client" &&
                messages[index - 1]?.sender !== "client" &&
                user && (
                  <Image
                    src={user.image}
                    alt="user"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}

              <p
                className={cn(
                  "max-w-[220px] rounded-xl p-2 text-[14px]",
                  message.sender === "client"
                    ? "bg-[#D9D9D9] text-slate-800"
                    : "bg-[#006D77] text-white",
                  messages[index - 1]?.sender === "client" && "ml-[58px]",
                )}
              >
                {message.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form className="flex h-[5%] items-center gap-2 rounded-b-md bg-[#D9D9D9] px-2">
        <Image src={Attachment} alt="attachment" width={32} height={32} />
        <input
          type="text"
          placeholder="Send Message..."
          className="w-full rounded-md border-none px-2 py-0 text-[10px]"
        />
        <button className="">
          <Image src={Send} alt="send" width={32} height={32} />
        </button>
      </form>
    </>
  );
}
