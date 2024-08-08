import { cn } from "@/lib/cn";
import { convert } from "html-to-text";
import Image from "next/image";
import { useRef } from "react";
// import Attachment from "@/public/icons/Attachment.svg";
// import Send from "@/public/icons/Send.svg";
// const messages = [
//   {
//     id: 1,
//     message: "Hello",
//     sender: "client",
//   },
//   {
//     id: 2,
//     message: "Hello there. How are you? I am fine. What about you?",
//     sender: "user",
//   },
//   {
//     id: 3,
//     message: "I am fine. Thanks for asking. What about you?",
//     sender: "client",
//   },
//   {
//     id: 4,
//     message: "I am fine. Thanks for asking. What about you?",
//     sender: "client",
//   },
//   {
//     id: 5,
//     message: "I am fine. Thanks for asking. What about you?",
//     sender: "client",
//   },
//   {
//     id: 6,
//     message: "Hello there. How are you? I am fine. What about you?",
//     sender: "user",
//   },

//   {
//     id: 7,
//     message: "I am fine. Thanks for asking. What about you?",
//     sender: "client",
//   },
//   {
//     id: 8,
//     message: "Hello there. How are you? I am fine. What about you?",
//     sender: "user",
//   },

//   {
//     id: 9,
//     message: "I am fine. Thanks for asking. What about you?",
//     sender: "client",
//   },
// ];
export default function Messages({ conversations }: any) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="h-[75%] 2xl:h-[85%]">
      <div className="h-[95%] overflow-y-scroll">
        {conversations.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex items-center p-1 ${
              message.labelIds[0] !== "SENT" ? "justify-start" : "justify-end"
            }`}
          >
            <div className="flex items-center gap-2 p-1">
              {message.labelIds[0] !== "SENT" &&
                conversations[index - 1]?.labelIds[0] !== "SENT" && (
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"
                    alt="user"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}

              <p
                className={cn(
                  "max-w-[220px] break-words rounded-xl p-2 text-[14px]",
                  message.labelIds[0] !== "SENT"
                    ? "bg-[#D9D9D9] text-slate-800"
                    : "bg-[#006D77] text-white",
                  conversations[index - 1]?.labelIds[0] !== "SENT" &&
                    "ml-[58px]",
                )}
              >
                {message.body || convert(message.html)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form className="flex h-[5%] items-center gap-x-2 rounded-b-md bg-[#D9D9D9] px-2 py-1">
        <input type="file" ref={fileRef} className="hidden" />
        <Image
          src="/icons/Attachment.svg"
          alt="attachment"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={() => {
            fileRef?.current?.click();
          }}
        />
        <div className="flex h-full w-full items-center gap-x-2 rounded-md bg-white">
          <input
            type="text"
            placeholder="Send Message..."
            className="h-full w-full rounded-md border-none px-2 py-0 text-[10px]"
          />
          <button className="px-2">
            <Image src="/icons/Send.svg" alt="send" width={20} height={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
