import { useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import { getGroupMessagesById } from "@/actions/communication/internal/query";
import { useSession } from "next-auth/react";
import { pusher } from "@/lib/pusher/client";

type TProps = {
  setGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
  totalMessageBox: number;
  group: any;
};
export default function GroupMessageBox({
  group,
  totalMessageBox,
  setGroupsList,
}: TProps) {
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchGroupMessages = async () => {
      const groupMessages = await getGroupMessagesById(group.id);
      setGroupMessages(
        groupMessages.map((m) => {
          return {
            message: m.message,
            sender: m.from === parseInt(session?.user?.id!) ? "USER" : "CLIENT",
          };
        }),
      );
    };
    fetchGroupMessages();
  }, []);

  // for group real-time messages
  useEffect(() => {
    const channel = pusher
      .subscribe(`group-${group.id}`)
      .bind(
        "message",
        ({ from, message }: { from: number; message: string }) => {
          if (from !== parseInt(session?.user?.id!)) {
              const newMessage = {
                message: message,
                sender: "CLIENT",
              };
              setGroupMessages((prevGroupMessages) => [
                ...prevGroupMessages,
                newMessage,
              ]);
          }
        },
      );

    return () => {
      channel.unbind();
    };
  }, []);
  return (
    <MessageBox
      fromGroup
      group={group}
      messages={groupMessages}
      setMessages={setGroupMessages}
      totalMessageBox={totalMessageBox}
      setGroupsList={setGroupsList}
    />
  );
}
