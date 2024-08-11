import { cn } from "@/lib/cn";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
export default function Messages({
  conversations,
  email,
  loading,
  base64Data,
  setBase64Data,
  setConversations,
}: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  const decodeBase64 = (base64String: string): Uint8Array => {
    // Extract the base64 part from the Data URL
    const base64Data = base64String.split(",")[1]; // This removes the `data:...;base64,` part

    if (!base64Data) {
      throw new Error("Invalid base64 string");
    }

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return byteArray;
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("recipient", email);
    formData.append("subject", "test");
    formData.append("text", messageInput);

    let base64FileData = "";
    if (file) {
      formData.append("file", file);
      const base64String = await convertFileToBase64(file); // Convert file to base64 string
      base64FileData = base64String.split(",")[1]; // Extract the base64 part only
    }

    // Optimistic UI update
    const newConversation = {
      attachments: file
        ? [
            {
              filename: file.name,
              mimeType: file.type,
              data: base64FileData, // Use the cleaned base64 string
            },
          ]
        : [],
      body: messageInput,
      labelIds: ["SENT"],
    };

    setConversations([...conversations, newConversation]);

    setMessageInput("");
    setFile(null);

    try {
      const res = await fetch("/api/communication/client", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      console.log("Message sent successfully:", res);
    } catch (err) {
      console.error("Error sending message:", err);
      // Optionally revert optimistic update here if needed
    }
  };


  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight + 100;
    }
  }, [conversations]);

  return (
    <div className="mb-2 h-[75%] 2xl:h-[85%]">
      <div ref={containerRef} className="h-[95%] overflow-y-scroll">
        {conversations
          .filter((convo: any) => convo.body)
          .map((message: any, index: number) => (
            <div
              key={index}
              className={`flex items-center p-1 ${
                message.labelIds[0] !== "SENT" ? "justify-start" : "justify-end"
              }`}
            >
              <div className="flex items-start gap-2 p-1">
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
                    "#max-w-[220px] break-words rounded-xl p-2 text-[14px]",
                    message.labelIds[0] !== "SENT"
                      ? "bg-[#D9D9D9] text-slate-800"
                      : "bg-[#006D77] text-white",
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

      {loading && conversations.length === 0 && (
        <div className="flex w-full items-center justify-center ">
          Loading...
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex h-[5%] items-center gap-x-2 rounded-b-md bg-[#D9D9D9] px-2 py-1"
      >
        {file && (
          <div className="text-xs text-[#006D77]">
            {file.name.length > 10 ? file.name.slice(0, 10) + "..." : file.name}
          </div>
        )}
        <input
          onChange={(e) =>
            e?.target?.files?.length && setFile(e?.target?.files[0])
          }
          type="file"
          className="hidden"
          ref={fileRef}
        />
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
