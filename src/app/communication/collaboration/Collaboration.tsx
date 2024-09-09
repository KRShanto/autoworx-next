"use client";

import { useState } from "react";
import List from "./List";
import UsersArea from "./UsersArea";
import { Company, User, Message as DbMessage } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";

export default function Collaboration({
  companies,
  currentUser,
  messages,
}: {
  companies: (Company & { users: User[] })[];
  currentUser: NextAuthUser;
  messages: DbMessage[];
}) {
  const [selectedUsersList, setSelectedUsersList] = useState<any[]>([]);

  return (
    <div className="mt-5 flex gap-5">
      <List companies={companies} setSelectedUsersList={setSelectedUsersList} />
      <UsersArea
        previousMessages={messages}
        currentUser={currentUser}
        totalMessageBoxLength={selectedUsersList.length}
        selectedUsersList={selectedUsersList}
        setSelectedUsersList={setSelectedUsersList}
      />
    </div>
  );
}
