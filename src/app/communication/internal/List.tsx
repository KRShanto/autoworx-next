import { Group, User } from "@prisma/client";
import CreateGroupModal from "./CreateGroupModal";
import Avatar from "@/components/Avatar";
import { useDebounce } from "@/hooks/useDebounce";
import { searchUsers } from "@/actions/communication/internal/searchUser";
import { useEffect, useState } from "react";
import { searchGroups } from "@/actions/communication/internal/searchGroup";
import { cn } from "@/lib/cn";
export default function List({
  users,
  setUsersList,
  groups,
  setGroupsList,
}: {
  users: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  setGroupsList: React.Dispatch<
    React.SetStateAction<(Group & { users: User[] }[]) | []>
  >;
  groups: (Group & { users: User[] })[] | [];
}) {
  const [usersStore, setUsersStore] = useState(users);
  const [groupsStore, setGroupsStore] = useState(groups);

  useEffect(() => {
    setGroupsStore(groups);
  }, [groups]);

  const handleSearch = useDebounce(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = event.target.value;
      const searchUsersResult = await searchUsers(searchTerm);
      const searchGroupsResult = await searchGroups(searchTerm);
      if (searchUsersResult.success || searchGroupsResult.success) {
        const foundedUsers = searchUsersResult.data;
        const foundedGroups = searchGroupsResult.data;
        setUsersStore(foundedUsers);
        setGroupsStore(foundedGroups);
      }
    },
    500,
  );
  return (
    <div className="app-shadow w-[20%] rounded-lg bg-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] text-[#795252]">User List</h2>
        <CreateGroupModal users={users} />
      </div>
      {/* Search */}
      <div>
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Search here..."
          className="my-3 mr-2 w-full rounded-md border-2 border-[#006D77] p-2 text-[12px] text-[#797979] focus:outline-none max-[1822px]:w-full"
        />
      </div>

      <div className="mt-2 flex h-[88%] flex-col gap-2 overflow-y-auto max-[2127px]:h-[80%]">
        {/* Group list */}
        {groupsStore.map((group) => {
          return (
            <button
              key={group.id}
              className="flex items-center gap-2 rounded-md bg-[#F2F2F2] p-2"
              onClick={() => {
                // add this user to the list (if not already in it)
                setGroupsList((groupList: any) => {
                  if (groupList.length >= 4) return groupList;
                  if (groupList.find((g: Group) => g?.id === group.id)) {
                    return groupList;
                  }
                  return [...groupList, group];
                });
              }}
            >
              <div
                className={cn(
                  "grid items-center",
                  group.users.length === 1 ? "grid-cols-1" : "grid-cols-2",
                )}
              >
                {group.users.slice(0, 4).map((user) => {
                  return (
                    <Avatar
                      photo={user.image}
                      width={40}
                      height={40}
                      key={user.id}
                    />
                  );
                })}
              </div>
              <div className="flex flex-col">
                <p className="text-[14px] font-bold text-[#797979]">
                  {group.name}
                </p>
              </div>
            </button>
          );
        })}
        {/* List */}
        {usersStore.map((user) => {
          return (
            <button
              key={user.id}
              className="flex items-center gap-2 rounded-md bg-[#F2F2F2] p-2"
              onClick={() => {
                // add this user to the list (if not already in it)
                setUsersList((usersList) => {
                  if (usersList.length >= 4) return usersList;
                  if (usersList.find((u) => u.id === user.id)) {
                    return usersList;
                  }
                  return [...usersList, user];
                });
              }}
            >
              <Avatar photo={user.image} width={60} height={60} />
              <div className="flex flex-col">
                <p className="text-[14px] font-bold text-[#797979]">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
