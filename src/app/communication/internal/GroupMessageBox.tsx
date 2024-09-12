import { useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import { getGroupMessagesById } from "@/actions/communication/internal/query";
import { useSession } from "next-auth/react";
import { pusher } from "@/lib/pusher/client";
import { Attachment, Group, User } from "@prisma/client";

type TProps = {
  setGroupsList: React.Dispatch<
    React.SetStateAction<(Group & { users: User[] })[]>
  >;
  totalMessageBox: number;
  group: Group & { users: User[] };
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
            userId: m.from,
            message: m.message,
            sender: m.from === parseInt(session?.user?.id!) ? "USER" : "CLIENT",
            attachment: m.attachment,
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
        ({
          from,
          message,
          attachment,
        }: {
          from: number;
          message: string;
          attachment: Attachment | null;
        }) => {
          if (from !== parseInt(session?.user?.id!)) {
            const newMessage = {
              userId: from,
              message: message,
              sender: "CLIENT",
              attachment,
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
