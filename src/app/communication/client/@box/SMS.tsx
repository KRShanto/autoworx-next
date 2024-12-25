import { sendMessage } from "@/actions/communication/client/sendMessage";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Conversation } from "../utils/types";

export default function SMS({ clientId }: { clientId: number }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  return (
    <div className="mb-2 h-[75%] 2xl:h-[85%]">
      <div ref={containerRef} className="h-[95%] w-full overflow-y-scroll">
        {[]
          .filter((convo: any) => convo.body)
          .map((message: any, index: number) => (
            <div
              key={index}
              className={`flex w-full items-center p-1 ${
                message.labelIds[0] !== "SENT" ? "justify-start" : "justify-end"
              }`}
            >
              <div className="flex w-full items-start gap-2 p-1">
                {message.labelIds[0] !== "SENT" && (
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"
                    alt="user"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                )}

                <p
                  className={cn(
                    "#max-w-[220px] max-w-[90%] break-words rounded-xl p-2 text-[14px]",
                    message.labelIds[0] !== "SENT"
                      ? "bg-[#D9D9D9] text-slate-800"
                      : "ml-auto bg-[#006D77] text-white",
                    // conversations[index - 1]?.labelIds[0] !== "SENT" &&
                    //   "ml-[58px]",
                  )}
                >
                  {message.body}
                </p>
              </div>
            </div>
          ))}
      </div>

      <form
        onSubmit={() => sendMessage({ clientId, message: "TEST" })}
        className="flex h-[5%] items-center gap-x-2 rounded-b-md bg-[#D9D9D9] px-2 py-1"
      >
        <div className="flex h-full w-full items-center gap-x-2 rounded-md bg-white">
          <input
            type="text"
            placeholder="Send Message..."
            className="h-full w-full rounded-md border-none px-2 py-0 text-[10px]"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button type="submit" className="px-2">
            <Image src="/icons/Send.svg" alt="send" width={20} height={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
