import React, { useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import { User } from "next-auth";
import { pusher } from "@/lib/pusher/client";
import { Message as DbMessage } from "@prisma/client";

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

  // console.log("Message Que", messages);

  return (
    <div className="flex w-full flex-wrap gap-4">
      {usersList.map((user) => {
        return (
          <MessageBox
            key={user.id}
            user={user}
            setUsersList={setUsersList}
            messages={messages.find((m) => m.user === user.id)?.messages || []}
            setMessages={setMessages}
          />
        );
      })}
    </div>
  );
}
