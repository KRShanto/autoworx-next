import React from "react";
import MessageBox from "./MessageBox";

export default function UsersArea({
  selectedUsersList,
  setSelectedUsersList,
}: {
  selectedUsersList: any[];
  setSelectedUsersList: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  return (
    <div className="w-full flex flex-wrap gap-4">
      {selectedUsersList.map((user) => {
        return (
          <MessageBox
            key={user.id}
            user={user}
            setSelectedUsersList={setSelectedUsersList}
          />
        );
      })}
    </div>
  );
}
