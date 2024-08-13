import React, { ReactNode, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { User } from "next-auth";
import { pusher } from "@/lib/pusher/client";
import { Message as DbMessage, Group } from "@prisma/client";
import { cn } from "@/lib/cn";
import GroupMessageBox from "./GroupMessageBox";

export interface MessageQue {
  user: number;
  messages: Message[];
}

export interface TGroupMessage {
  groupId: number;
  messages: Message[];
}

export interface Message {
  userId?: number;
  message: string;
  sender: "CLIENT" | "USER";
}

export default function UsersArea({
  currentUser,
  usersList,
  setUsersList,
  previousMessages,
  groupsList,
  setGroupsList,
}: {
  currentUser: User;
  usersList: any[];
  setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  setGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
  previousMessages: DbMessage[];
  groupsList: any;
}) {
  const [messages, setMessages] = useState<MessageQue[]>([]);

  // for normal messages
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

  // for user real-time messages
  useEffect(() => {
    const channel = pusher
      .subscribe(`user-${currentUser.id}`)
      .bind(
        "message",
        ({ from, message }: { from: number; message: string }) => {
          console.log("Received message", { from, message });
          const user = usersList.find((u) => {
            return u.id === from;
          });
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
  }, [usersList, messages]);

  const totalMessageBoxLength = usersList.length + groupsList.length;
  return (
    <div
      className={cn(
        "grid h-[88vh] w-full gap-3",
        totalMessageBoxLength > 1 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {usersList.map((user) => {
        const findMessages =
          messages.find((m) => m.user === user.id)?.messages || [];
        return (
          <MessageBox
            key={user.id}
            user={user}
            setUsersList={setUsersList}
            messages={[...findMessages]}
            setMessages={setMessages}
            totalMessageBox={totalMessageBoxLength}
          />
        );
      })}
      {groupsList.map((group: any) => {
        return (
          <GroupMessageBox
            key={group.id}
            group={group}
            totalMessageBox={totalMessageBoxLength}
            setGroupsList={setGroupsList}
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
