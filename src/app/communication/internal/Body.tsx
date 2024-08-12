"use client";

import { useState } from "react";
import List from "./List";
import UsersArea from "./UsersArea";
import { User as NextAuthUser } from "next-auth";
import { Message, User } from "@prisma/client";

export default function Body({
  users,
  currentUser,
  messages,
  groups,
}: {
  users: User[];
  currentUser: NextAuthUser;
  messages: Message[];
  groups: any;
}) {
  const [usersList, setUsersList] = useState<User[]>([]);
  console.log({ usersList });
  return (
    <>
      <List groups={groups} users={users} setUsersList={setUsersList} />
      <UsersArea
        usersList={usersList}
        setUsersList={setUsersList}
        currentUser={currentUser}
        previousMessages={messages}
      />
    </>
  );
}
