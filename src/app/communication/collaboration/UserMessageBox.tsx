import { useState, useEffect, SetStateAction } from "react";
import MessageBox from "../MessageBox";
import { useSession } from "next-auth/react";
import { getUserMessagesById } from "@/actions/communication/internal/query";
import { Attachment, RequestEstimate } from "@prisma/client";
import { pusher } from "@/lib/pusher/client";

type TProps = {
  user: any;
  setUsersList: React.Dispatch<SetStateAction<any[]>>;
  totalMessageBoxLength: number;
};

export default function UserMessageBox({
  user,
  setUsersList,
  totalMessageBoxLength,
}: TProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const { data: session } = useSession();

  // message from db
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
            requestEstimate: m.requestEstimate,
          };
        }),
      );
    };
    fetchMessages();
  }, []);

  // real-time message from pusher
  useEffect(() => {
    const channel = pusher
      .subscribe(`user-${user?.id}`)
      .bind(
        "message",
        ({
          to,
          from,
          message,
          attachment,
          requestEstimate,
        }: {
          to: number;
          from: number;
          message: string;
          attachment: Partial<Attachment>;
          requestEstimate: RequestEstimate | null;
        }) => {
          if (
            from !== parseInt(session?.user?.id!) &&
            to === parseInt(session?.user?.id!)
          ) {
            const newMessage = {
              message,
              sender: "CLIENT",
              attachment,
              requestEstimate,
            };
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
  }, [user, session?.user?.id]);

  return (
    <MessageBox
      user={user}
      setUsersList={setUsersList}
      messages={messages}
      setMessages={setMessages}
      totalMessageBox={totalMessageBoxLength}
    />
  );
}
