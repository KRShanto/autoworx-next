import React, { useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import { User } from "next-auth";
import { pusher } from "@/lib/pusher/client";
import { Message as DbMessage } from "@prisma/client";
import { cn } from "@/lib/cn";

export interface MessageQue {
  user: number;
  messages: Message[];
}

export interface Message {
  message: string;
  sender: "CLIENT" | "USER";
}

export default function UsersArea({
  currentUser,
  usersList,
  setUsersList,
  previousMessages,
}: {
  currentUser: User;
  usersList: any[];
  setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  previousMessages: DbMessage[];
}) {
  const [messages, setMessages] = useState<MessageQue[]>([]);
  const [isTrigger, setIsTrigger] = useState(false);
  useEffect(() => {
    const messages: MessageQue[] = [];

    for (const user of usersList) {
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
          };
        }),
      });
    }

    setMessages(messages);
  }, [usersList, previousMessages, currentUser]);

  useEffect(() => {
    const channel = pusher
      .subscribe(`user-${currentUser.id}`)
      .bind(
        "message",
        ({ from, message }: { from: number; message: string }) => {
          console.log({ from, message });
          const user = usersList.find((u) => u.id === from);
          if (!user) {
            return;
          }

          const newMessages = [...messages];
          const userMessages = newMessages.find((m) => m.user === from);

          if (userMessages) {
            userMessages.messages.push({ message, sender: "CLIENT" });
          } else {
            newMessages.push({
              user: from,
              messages: [{ message, sender: "CLIENT" }],
            });
          }

          setMessages(newMessages);
        },
      );

    return () => {
      channel.unbind();
    };
  }, []);
  
  const totalUserListLength = usersList.length;

  return (
    <div
      className={cn(
        "grid h-[88vh] w-full gap-3",
        totalUserListLength > 1 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {usersList.map((user) => {
        return (
          <MessageBox
            key={user.id}
            user={user}
            setUsersList={setUsersList}
            messages={messages.find((m) => m.user === user.id)?.messages || []}
            setMessages={setMessages}
            setIsTrigger={setIsTrigger}
            totalMessageBox={totalUserListLength}
          />
        );
      })}
      {totalUserListLength === 3 && (
        <div
          className={cn(
            "app-shadow flex w-full border-spacing-4 flex-col overflow-hidden rounded-lg max-[1400px]:w-[100%]",
            totalUserListLength > 2 && "h-[44vh]",
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
