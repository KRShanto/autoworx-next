import React, { useEffect, useState } from "react";
// import MessageBox from "./MessageBox";
import { cn } from "@/lib/cn";
import MessageBox from "../internal/MessageBox";
import { pusher } from "@/lib/pusher/client";
import { MessageQue } from "../internal/UsersArea";
import { Attachment, Message } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";

export default function UsersArea({
  currentUser,
  selectedUsersList,
  setSelectedUsersList,
  totalMessageBoxLength,
  previousMessages,
  companyName,
}: {
  companyName: string | null;
  previousMessages: (Message & { attachment: Attachment | null })[];
  currentUser: NextAuthUser;
  selectedUsersList: any[];
  setSelectedUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  totalMessageBoxLength: number;
}) {
  const [messages, setMessages] = useState<MessageQue[]>([]);

  console.log(messages);

  // for normal messages
  useEffect(() => {
    const messages: MessageQue[] = [];
    for (const user of selectedUsersList) {
      const userMessages = previousMessages.filter(
        (m) => m.from === user.id || m.to === user.id,
      );

      messages.push({
        user: user.id,
        messages: userMessages.map((m) => {
          return {
            message: m.message,
            // @ts-ignore
            sender: m.from === currentUser.id ? "USER" : "CLIENT",
            attachment: m.attachment,
          };
        }),
      });
    }

    setMessages(messages);
  }, [selectedUsersList, previousMessages, currentUser]);

  // for user real-time messages
  useEffect(() => {
    const channel = pusher
      .subscribe(`user-${currentUser.id}`)
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
          console.log("Received message", { from, message });
          const user = selectedUsersList.find((u) => {
            return u.id === from;
          });
          if (!user) {
            return;
          }

          const newMessages = [...messages];
          const userMessages = newMessages.find((m) => m.user === from);
          if (userMessages) {
            userMessages.messages.push({
              message,
              sender: "CLIENT",
              // @ts-ignore
              attachment: attachment,
            });
          } else {
            newMessages.push({
              user: from,
              // @ts-ignore
              messages: [{ message, sender: "CLIENT", attachment: attachment }],
            });
          }
          setMessages(newMessages);
        },
      );

    return () => {
      channel.unbind();
    };
  }, [selectedUsersList, messages]);
  return (
    <div
      className={cn(
        "grid h-[88vh] w-full gap-3",
        totalMessageBoxLength > 1 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {selectedUsersList.map((user) => {
        const findMessages =
          messages.find((m) => m.user === user.id)?.messages || [];
        console.log({ user });
        return (
          <MessageBox
            key={user.id}
            user={user}
            companyName={companyName}
            setUsersList={setSelectedUsersList}
            messages={[...findMessages]}
            setMessages={setMessages}
            totalMessageBox={totalMessageBoxLength}
          />
        );
      })}

      {totalMessageBoxLength === 3 && (
        <div
          className={cn(
            "app-shadow flex w-full border-spacing-4 flex-col overflow-hidden rounded-lg max-[1400px]:w-[100%]",
            totalMessageBoxLength > 2 && "h-[44vh]",
          )}
          style={{
            borderWidth: "4px",
            borderColor: "#006D77",
            borderStyle: "dashed",
            backgroundColor: "#DFEBED",
          }}
        />
      )}
    </div>
  );
}
