import { cn } from "@/lib/cn";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

export default function MessageBox({
  user,
  setSelectedUsersList,
}: {
  user: any; // TODO: type this
  setSelectedUsersList: React.Dispatch<React.SetStateAction<any[]>>;
}) {
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
          <Image src="/icons/Chat.png" alt="chat" width={10} height={10} />
          <Image src="/icons/Email.png" alt="chat" width={10} height={10} />
          <Image src="/icons/Phone.png" alt="phone" width={10} height={10} />

          <FaTimes
            className="cursor-pointer text-sm"
            onClick={() => {
              setSelectedUsersList((usersList) =>
                usersList.filter((u) => u.id !== user.id),
              );
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="h-[82%] overflow-y-scroll">
        {messages.map((message: any, index: number) => (
          <div
            key={message.id}
            className={`flex items-center p-1 ${
              message.sender === "client" ? "justify-start" : "justify-end"
            }`}
          >
            <div className="flex items-center gap-2 p-1">
              {message.sender === "client" &&
                messages[index - 1]?.sender !== "client" && (
                  <Image src={user.image} alt="user" width={30} height={30} />
                )}

              <p
                className={cn(
                  "max-w-[220px] rounded-xl p-2 text-[10px]",
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

      {/* Input */}
      <form className="flex h-[8%] items-center gap-2 bg-[#D9D9D9] p-2">
        <Image
          src="/icons/Attachment.svg"
          alt="Attachments icon"
          width={15}
          height={15}
        />
        <input
          type="text"
          placeholder="Send Message..."
          className="h-5 w-full rounded-md border-none px-1 py-0 text-[8px]"
        />
        <button>
          <Image src="/icons/Send.svg" alt="Send" width={20} height={20} />
        </button>
      </form>
    </div>
  );
}
