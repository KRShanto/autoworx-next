import React, { SetStateAction, useEffect, useState } from "react";
import MessageBox from "../MessageBox";
import { User } from "next-auth";
import { pusher } from "@/lib/pusher/client";
import { Attachment, Message as DbMessage, Group } from "@prisma/client";
import { cn } from "@/lib/cn";
import GroupMessageBox from "./GroupMessageBox";
import UserMessageBox from "./UserMessageBox";

export interface MessageQue {
  user: number;
  messages: (Message & { attachment: Attachment | null })[];
}

export interface TGroupMessage {
  groupId: number;
  messages: Message[];
}

export interface Message {
  userId?: number;
  message: string;
  sender: "CLIENT" | "USER";
  attachment: Attachment | null;
}

export default function UsersArea({
  currentUser,
  usersList,
  setUsersList,
  groupsList,
  setGroupsList,
}: {
  currentUser: User;
  usersList: any[];
  setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  setGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
  groupsList: any;
}) {
  const [realTimeMessages, setRealTimeMessages] = useState<Record<
    string,
    any
  > | null>(null);

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
          attachment: Attachment | null;
        }) => {
          setRealTimeMessages({ from, message, attachment });
        },
      );

    return () => {
      channel.unbind("message");
    };
  }, []);

  const totalMessageBoxLength = usersList.length + groupsList.length;
  
  return (
    <div
      className={cn(
        "grid h-[88vh] w-full gap-3",
        totalMessageBoxLength > 1 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {usersList.map((user) => {
        return (
          <UserMessageBox
            key={user.id}
            user={user}
            realTimeMessages={realTimeMessages}
            setUsersList={setUsersList}
            totalMessageBoxLength={totalMessageBoxLength}
          />
        );
      })}
      {groupsList.map((group: any) => {
        return (
          <GroupMessageBox
            key={group.id}
            group={group}
            setGroupsList={setGroupsList}
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
