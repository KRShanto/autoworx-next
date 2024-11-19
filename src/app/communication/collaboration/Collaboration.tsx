"use client";

import { useState } from "react";
import List from "./List";
import UsersArea from "./UsersArea";
import {
  Company,
  User,
  Message as DbMessage,
  Attachment,
} from "@prisma/client";
import { User as NextAuthUser } from "next-auth";

export default function Collaboration({
  companyWithAdmin,
  companies,
  currentUser,
  messages,
}: {
  companyWithAdmin: Partial<User>[];
  companies: (Company & { users: User[] })[];
  currentUser: NextAuthUser;
  messages: (DbMessage & { attachment: Attachment | null })[];
}) {
  const [selectedUsersList, setSelectedUsersList] = useState<User[]>([]);
  const [companyAdmins, setCompanyAdmins] = useState(companyWithAdmin);
  console.log("selectedUsersList", selectedUsersList);
  return (
    <div className="mt-5 flex gap-5">
      <List
        companyAdmins={companyAdmins}
        setCompanyAdmins={setCompanyAdmins}
        companies={companies}
        setSelectedUsersList={setSelectedUsersList}
      />
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
