import { useState, useEffect, SetStateAction } from "react";
import MessageBox from "../MessageBox";
import { useSession } from "next-auth/react";
import { getUserMessagesById } from "@/actions/communication/internal/query";
import { Attachment } from "@prisma/client";
import { pusher } from "@/lib/pusher/client";

type TProps = {
  user: any;
  setUsersList: React.Dispatch<SetStateAction<any[]>>;
  totalMessageBoxLength: number;
  companyName?: string | null;
};

export default function UserMessageBox({
  user,
  setUsersList,
  totalMessageBoxLength,
  companyName,
}: TProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [realTimeMessage, setRealTimeMessage] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMessages = async function () {
      const findUserMessage = await getUserMessagesById(
        parseInt(session?.user?.id!),
      );
      const userMessages = findUserMessage.filter(
        (m) => m.from === user.id || m.to === user.id,
      );
      setMessages(
        userMessages.map((m) => {
          return {
            message: m.message,
            // @ts-ignore
            sender: m.from === session?.user.id ? "USER" : "CLIENT",
            attachment: m.attachment,
          };
        }),
      );
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const channel = pusher
      .subscribe(`user-${user?.id}`)
      .bind(
        "message",
        ({
          from,
          message,
          attachment,
        }: {
          from: number;
          message: string;
          attachment: Partial<Attachment>;
        }) => {
          if (from !== parseInt(session?.user?.id!)) {
            const newMessage = {
              message,
              sender: "CLIENT",
              attachment,
            };
            setRealTimeMessage(newMessage);
            setMessages((prevGroupMessages) => [
              ...prevGroupMessages,
              newMessage,
            ]);
          }
        },
      );
    return () => {
      channel.unbind("message");
    };
  }, [user]);

  return (
    <MessageBox
      user={user}
      companyName={companyName}
      setUsersList={setUsersList}
      messages={messages}
      setMessages={setMessages}
      totalMessageBox={totalMessageBoxLength}
    />
  );
}
