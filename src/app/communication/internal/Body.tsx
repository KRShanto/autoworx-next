"use client";

import { useState } from "react";
import List from "./List";
import UsersArea from "./UsersArea";
import { User as NextAuthUser } from "next-auth";
import { Group, User } from "@prisma/client";

export default function Body({
  users,
  currentUser,
  groups,
}: {
  users: User[];
  currentUser: NextAuthUser;
  groups: (Group & { users: User[] })[];
}) {
  const [usersList, setUsersList] = useState<User[]>([]);

  const [groupsList, setGroupsList] = useState<(Group & { users: User[] })[]>(
    [],
  );

  return (
    <>
      <List
        groups={groups}
        users={users}
        setUsersList={setUsersList}
        setGroupsList={
          setGroupsList as React.Dispatch<
            React.SetStateAction<(Group & { users: User[] }[]) | []>
          >
        }
      />
      <UsersArea
        usersList={usersList}
        setUsersList={setUsersList}
        currentUser={currentUser}
        groupsList={groupsList}
        setGroupsList={setGroupsList}
      />
    </>
  );
}
