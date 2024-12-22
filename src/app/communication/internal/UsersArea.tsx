import React, { SetStateAction, useEffect, useState } from "react";
import MessageBox from "../MessageBox";
import { User } from "next-auth";
import { pusher } from "@/lib/pusher/client";
import {
  Attachment,
  Message as DbMessage,
  Group,
  RequestEstimate,
} from "@prisma/client";
import { cn } from "@/lib/cn";
import GroupMessageBox from "./GroupMessageBox";
import UserMessageBox from "./UserMessageBox";

export interface MessageQue {
  user: number;
  messages: (Message & { attachment: Attachment[] | null })[];
}

export interface TGroupMessage {
  groupId: number;
  messages: Message[];
}

export interface Message {
  userId?: number;
  message: string;
  sender: "CLIENT" | "USER";
  attachment?: Attachment[] | null;
  requestEstimate?: RequestEstimate | null;
}

export default function UsersArea({
  currentUser,
  usersList,
  setUsersList,
  groupsList,
  setGroupsList,
  className,
}: {
  currentUser: User;
  usersList: any[];
  setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  setGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
  groupsList: any;
  className?: string;
}) {
  const totalMessageBoxLength = usersList.length + groupsList.length;

  return (
    <div
      className={cn(
        "w-full gap-3 sm:grid md:h-[88vh]",
        totalMessageBoxLength > 1 ? "grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {usersList.map((user) => {
        return (
          <UserMessageBox
            key={user.id}
            user={user}
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
            totalMessageBoxLength > 2 && "sm:h-[44vh]",
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
