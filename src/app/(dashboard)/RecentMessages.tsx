import { FullMessage } from "@/actions/dashboard/technician/recentMessages";
import { useServerGet } from "@/hooks/useServerGet";
import getUser from "@/lib/getUser";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

const RecentMessages = ({
  messages = [],
  fullHeight = false,
}: {
  messages?: FullMessage[] | [];
  fullHeight?: boolean;
}) => {
  const { data: user } = useServerGet(getUser);
  return (
    <div
      className={`"flex ${fullHeight ? "h-full" : "h-[82vh]"} shadow-lg" flex-col rounded-md p-6`}
    >
      <div className="mb-4 flex h-[15%] items-center justify-between">
        <span className="text-xl font-bold">Recent Messages</span>{" "}
        <Link href="/communication/internal">
          <FaExternalLinkAlt />
        </Link>
      </div>
      <div className="#custom-scrollbar flex h-[85%] flex-1 flex-col text-sm">
        <input
          className="mb-4 h-[10%] w-full rounded border border-[#03A7A2] px-4 py-2"
          type="text"
          placeholder="Search messages"
        />
        <div className="custom-scrollbar #justify-center flex h-[90%] w-full flex-1 flex-col items-center space-y-4 self-center">
          {messages?.map((msg, idx) => (
            <Message message={msg} key={idx} user={user as User} />
          ))}
          {messages?.length === 0 && (
            <span className="text-center">You have no recent messages</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Message = ({ message, user }: { message: FullMessage; user: User }) => {
  return (
    <div className="flex w-full flex-col gap-x-2 rounded border p-2 px-2 xl:flex-row xl:items-start">
      <Image
        width={60}
        height={60}
        src={
          message?.from?.image ? message?.from?.image : "/images/default.png"
        }
        alt=""
      />
      <div>
        <p className="font-semibold">
          {user.id === message?.from?.id
            ? (message?.to?.firstName || "") + (message?.to?.lastName || "")
            : (message?.from?.firstName || "") +
              (message?.from?.lastName || "")}
        </p>
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default RecentMessages;
