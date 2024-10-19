import { Group, User } from "@prisma/client";
import CreateGroupModal from "./CreateGroupModal";
import Avatar from "@/components/Avatar";
// import { useDebounce } from "@/hooks/useDebounce";
// import { searchUsers } from "@/actions/communication/internal/searchUser";
// import { useEffect, useState } from "react";
// import { searchGroups } from "@/actions/communication/internal/searchGroup";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";
import { pusher } from "@/lib/pusher/client";
import { useSession } from "next-auth/react";
import { getGroupById } from "@/actions/communication/internal/query";
export default function List({
  users,
  setUsersList,
  groups,
  setGroupsList,
  className,
}: {
  users: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  setGroupsList: React.Dispatch<
    React.SetStateAction<(Group & { users: User[] }[]) | []>
  >;
  groups: (Group & { users: User[] })[] | [];
  className?: string;
}) {
  // const [usersStore, setUsersStore] = useState(users);
  // const [groupsStore, setGroupsStore] = useState(groups);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [sideBarGroupsLists, setSideBarGroupLists] = useState(groups);

  useEffect(() => {
    let ignore = true;
    pusher
      .subscribe("create-group")
      .bind(
        "create",
        ({
          groupId,
          usersIds,
        }: {
          groupId: number;
          usersIds: { id: number }[];
        }) => {
          usersIds.forEach((userId) => {
            if (userId.id === Number(session?.user?.id!)) {
              const group = sideBarGroupsLists.find((g) => g.id === groupId);
              if (!group) {
                getGroupById(groupId, userId.id).then((groupFromDb) => {
                  if (groupFromDb) {
                    if (!ignore) {
                      setSideBarGroupLists((prevGroups) => [
                        ...prevGroups,
                        groupFromDb,
                      ]);
                    }
                  }
                });
              }
            }
          });
        },
      );
    return () => {
      ignore = false;
      pusher.unbind("create");
    };
  }, []);

  useEffect(() => {
    // let ignore = true;
    pusher
      .subscribe("delete-group")
      .bind(
        "delete",
        ({ groupId, userId }: { groupId: number; userId: number }) => {
          if (userId === Number(session?.user?.id!)) {
            setSideBarGroupLists((prevSideBarGroupsLists) => {
              const isAlreadyExistInGroup = prevSideBarGroupsLists.find(
                (group) => group.id === groupId,
              );
              if (isAlreadyExistInGroup) {
                return prevSideBarGroupsLists.filter(
                  (group) => group.id !== groupId,
                );
              } else {
                return prevSideBarGroupsLists;
              }
            });

            setGroupsList((groupLists: any) => {
              return groupLists.filter((group: any) => group.id !== groupId);
            });
          } else {
            const removeGroupUser = (groupList: any) =>
              groupList.map((g: any) => {
                if (g.id === groupId) {
                  return {
                    ...g,
                    users: g.users.filter((user: User) => user.id !== userId),
                  };
                }
                return g;
              });
            setGroupsList(removeGroupUser);
            setSideBarGroupLists(removeGroupUser);
          }
        },
      );
    return () => {
      pusher.unbind("delete");
    };
  }, []);

  // useEffect(() => {
  //   setGroupsStore(groups);
  // }, [groups]);

  // const handleSearch = useDebounce(
  //   async (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const searchTerm = event.target.value;
  //     const searchUsersResult = await searchUsers(searchTerm);
  //     const searchGroupsResult = await searchGroups(searchTerm);
  //     if (searchUsersResult.success || searchGroupsResult.success) {
  //       const foundedUsers = searchUsersResult.data;
  //       const foundedGroups = searchGroupsResult.data;
  //       setUsersStore(foundedUsers);
  //       setGroupsStore(foundedGroups);
  //     }
  //   },
  //   500,
  // );
  return (
    <div
      className={cn(
        "app-shadow min-h-screen w-full rounded-lg bg-white p-3 sm:block sm:min-h-[80vh] sm:w-[20%]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#795252] sm:text-[14px] sm:font-normal">
          User List
        </h2>
        <CreateGroupModal users={users} />
      </div>
      {/* Search */}
      <div>
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search here..."
          className="my-3 mr-2 w-full rounded-md border-2 border-[#006D77] p-2 text-[12px] text-[#797979] focus:outline-none max-[1822px]:w-full"
        />
      </div>

      <div className="mt-2 flex h-[88%] flex-col gap-2 overflow-y-auto max-[2127px]:h-[80%]">
        {/* Group list */}
        {sideBarGroupsLists
          .filter((group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((group) => {
            return (
              <button
                key={group.id}
                className="flex items-center gap-2 rounded-md border border-[#006D77] bg-[#F2F2F2] p-2 sm:border-0"
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
        {users
          .filter(
            (user) =>
              user.firstName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((user) => {
            return (
              <button
                key={user.id}
                className="flex items-center gap-2 rounded-md border border-[#006D77] bg-[#F2F2F2] p-2 sm:border-0"
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
