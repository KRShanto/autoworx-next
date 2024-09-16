import React, { useEffect, useState } from "react";
// import MessageBox from "./MessageBox";
import { cn } from "@/lib/cn";
import { pusher } from "@/lib/pusher/client";
import { Attachment, Message } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";
import UserMessageBox from "../internal/UserMessageBox";

export default function UsersArea({
  currentUser,
  selectedUsersList,
  setSelectedUsersList,
  totalMessageBoxLength,
  companyName,
}: {
  companyName: string | null;
  previousMessages: (Message & { attachment: Attachment | null })[];
  currentUser: NextAuthUser;
  selectedUsersList: any[];
  setSelectedUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  totalMessageBoxLength: number;
}) {
  const [realTimeMessages, setRealTimeMessages] = useState<Record<
    string,
    any
  > | null>(null);
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
          setRealTimeMessages({ from, message, attachment });
        },
      );

    return () => {
      channel.unbind();
    };
  }, []);
  return (
    <div
      className={cn(
        "grid h-[88vh] w-full gap-3",
        totalMessageBoxLength > 1 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {selectedUsersList.map((user) => {
        return (
          <UserMessageBox
            key={user.id}
            user={user}
            companyName={companyName}
            setUsersList={setSelectedUsersList}
            totalMessageBoxLength={totalMessageBoxLength}
            realTimeMessages={realTimeMessages}
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
