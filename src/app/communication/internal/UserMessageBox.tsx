import { useState, useEffect, SetStateAction } from "react";
import MessageBox from "../MessageBox";
import { useSession } from "next-auth/react";
import { getUserMessagesById } from "@/actions/communication/internal/query";

type TProps = {
  user: any;
  setUsersList: React.Dispatch<SetStateAction<any[]>>;
  totalMessageBoxLength: number;
  realTimeMessages: any;
  companyName?: string | null;
};

export default function UserMessageBox({
  user,
  setUsersList,
  totalMessageBoxLength,
  realTimeMessages,
  companyName,
}: TProps) {
  const [messages, setMessages] = useState<any[]>([]);
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
    if (
      realTimeMessages &&
      realTimeMessages?.from !== parseInt(session?.user?.id!)
    ) {
      const newMessage = {
        message: realTimeMessages?.message,
        sender: "CLIENT",
        attachment: realTimeMessages?.attachment,
      };
      setMessages((prevGroupMessages) => [...prevGroupMessages, newMessage]);
    }
  }, [realTimeMessages]);

  // useEffect(() => {
  //   console.log("running useEffect", { currentUserId: currentUser.id });
  //   const channel = pusher
  //     .subscribe(`user-${currentUser.id}`)
  //     .bind(
  //       "message",
  //       ({
  //         from,
  //         message,
  //         attachment,
  //       }: {
  //         from: number;
  //         message: string;
  //         attachment: Attachment | null;
  //       }) => {
  //         console.log("Received message", {
  //           from,
  //           message,
  //           currentUser: user.id,
  //         });
  //         if (from !== parseInt(session?.user?.id!)) {
  //           const newMessage = {
  //             message,
  //             sender: "CLIENT",
  //             attachment: attachment,
  //           };
  //           setMessages((prevGroupMessages) => [
  //             ...prevGroupMessages,
  //             newMessage,
  //           ]);
  //         }
  //       },
  //     );

  //   return () => {
  //     channel.unbind();
  //   };
  // }, []);

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
