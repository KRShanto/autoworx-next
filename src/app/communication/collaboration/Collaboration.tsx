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
import { cn } from "@/lib/cn";

export default function Collaboration({
  companyWithAdmin,
  companies,
  currentUser,
  messages,
}: {
  companyWithAdmin: Partial<User>[];
  companies: (Company & { users: User[] })[];
  currentUser: NextAuthUser;
  messages: (DbMessage & { attachment: Attachment[] | null })[];
}) {
  const [selectedUsersList, setSelectedUsersList] = useState<User[]>([]);
  const [companyAdmins, setCompanyAdmins] = useState(companyWithAdmin);
  return (
    <div className="flex gap-5 sm:mt-5">
      <List
        selectedUsersList={selectedUsersList}
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
