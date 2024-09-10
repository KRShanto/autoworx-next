"use client";

import { useState } from "react";
import List from "./List";
import UsersArea from "./UsersArea";
import { Company, User, Message as DbMessage } from "@prisma/client";
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
  messages: DbMessage[];
}) {
  const [selectedUsersList, setSelectedUsersList] = useState<User[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [companyAdmins, setCompanyAdmins] = useState(companyWithAdmin);
  return (
    <div className="mt-5 flex gap-5">
      <List
        companyAdmins={companyAdmins}
        setCompanyAdmins={setCompanyAdmins}
        companies={companies}
        setSelectedUsersList={setSelectedUsersList}
        setCompanyName={setCompanyName}
      />
      <UsersArea
        companyName={companyName}
        previousMessages={messages}
        currentUser={currentUser}
        totalMessageBoxLength={selectedUsersList.length}
        selectedUsersList={selectedUsersList}
        setSelectedUsersList={setSelectedUsersList}
      />
    </div>
  );
}
