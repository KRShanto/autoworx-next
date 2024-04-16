"use client";

import { useState } from "react";
import List from "./List";
import UsersArea from "./UsersArea";

export default function Collaboration() {
  const [selectedUsersList, setSelectedUsersList] = useState<any[]>([]);

  return (
    <div className="mt-5 flex gap-5">
      <List setSelectedUsersList={setSelectedUsersList} />
      <UsersArea
        selectedUsersList={selectedUsersList}
        setSelectedUsersList={setSelectedUsersList}
      />
    </div>
  );
}
