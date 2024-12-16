import { Group, User } from "@prisma/client";
import CreateGroupModal from "./CreateGroupModal";
import Avatar from "@/components/Avatar";
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
  groupsList,
  usersList,
  className,
}: {
  users: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  setGroupsList: React.Dispatch<
    React.SetStateAction<(Group & { users: User[] }[]) | []>
  >;
  groups: (Group & { users: User[] })[] | [];
  className?: string;
  groupsList: (Group & { users: User[] })[];
  usersList: User[];
}) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [sideBarGroupsLists, setSideBarGroupLists] = useState(groups);

  // create new group for real time update
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
          getGroupById(groupId, Number(session?.user?.id!)).then(
            (groupFromDb) => {
              if (groupFromDb) {
                if (!ignore) {
                  setSideBarGroupLists((prevGroups) => {
                    const isExistInGroup = prevGroups.find(
                      (g) => g.id === groupId,
                    );
                    if (!isExistInGroup) {
                      return [...prevGroups, groupFromDb];
                    } else {
                      return prevGroups;
                    }
                  });
                }
              }
            },
          );
        },
      );
    return () => {
      ignore = false;
      pusher.unbind("create");
    };
  }, []);

  // delete member from group for real time update
  useEffect(() => {
    let ignore = true;
    pusher
      .subscribe("delete-group")
      .bind(
        "delete",
        ({ groupId, userId }: { groupId: number; userId: number }) => {
          getGroupById(groupId, Number(session?.user?.id!)).then(
            (groupFromDb) => {
              if (groupFromDb) {
                if (!ignore) {
                  setSideBarGroupLists((prevGroups) => {
                    const isAlreadyExistInGroup = prevGroups.find(
                      (group) => group.id === groupId,
                    );
                    if (isAlreadyExistInGroup) {
                      return prevGroups.map((group) => {
                        if (group.id === groupId) {
                          return groupFromDb;
                        } else {
                          return group;
                        }
                      });
                    } else {
                      return prevGroups;
                    }
                  });
                  setGroupsList((groupLists: any) => {
                    return groupLists.map((group: any) => {
                      if (group.id === groupId) {
                        return groupFromDb;
                      } else {
                        return group;
                      }
                    });
                  });
                }
              } else {
                setSideBarGroupLists((prevGroups) => {
                  const isAlreadyExistInGroup = prevGroups.find(
                    (group) => group.id === groupId,
                  );
                  if (isAlreadyExistInGroup) {
                    return prevGroups.filter((group) => group.id !== groupId);
                  } else {
                    return prevGroups;
                  }
                });
                setGroupsList((groupLists: any) => {
                  return groupLists.filter(
                    (group: any) => group.id !== groupId,
                  );
                });
              }
            },
          );
        },
      );
    return () => {
      ignore = false;
      pusher.unbind("delete");
    };
  }, []);

  // add new member to group and update sidebar for real time update
  useEffect(() => {
    // "add-member-in-group", "add-member"
    let ignore = true;
    pusher
      .subscribe("add-member-in-group")
      .bind("add-member", ({ groupId }: { groupId: number }) => {
        getGroupById(groupId, Number(session?.user?.id!)).then(
          (groupFromDb) => {
            if (groupFromDb) {
              if (!ignore) {
                setSideBarGroupLists((prevGroups) => {
                  const isAlreadyExistInGroup = prevGroups.find(
                    (group) => group.id === groupId,
                  );
                  if (isAlreadyExistInGroup) {
                    return prevGroups.map((group) => {
                      if (group.id === groupId) {
                        return groupFromDb;
                      } else {
                        return group;
                      }
                    });
                  } else {
                    return [...prevGroups, groupFromDb];
                  }
                });
                setGroupsList((groupLists: any) => {
                  return groupLists.map((group: any) => {
                    if (group.id === groupId) {
                      return groupFromDb;
                    } else {
                      return group;
                    }
                  });
                });
              }
            }
          },
        );
      });
    return () => {
      ignore = false;
      pusher.unbind("add-member");
    };
  }, []);

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
        <CreateGroupModal
          users={users}
          setSideBarGroupLists={setSideBarGroupLists}
        />
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
            const isSelectedGroup = !!groupsList.find((g) => g.id === group.id);
            return (
              <button
                key={group.id}
                className={cn(
                  "flex items-center gap-2 rounded-md border border-[#006D77] bg-[#F2F2F2] p-2 hover:bg-gray-300 sm:border-0",
                  isSelectedGroup && "bg-[#006D77]",
                )}
                onClick={() => {
                  // add this user to the list (if not already in it)
                  setGroupsList((groupList: any) => {
                    if (groupList.length + usersList.length >= 4)
                      return groupList;
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
                  {group.users.length > 0 &&
                    group.users?.slice(0, 4).map((user) => {
                      return (
                        <Avatar
                          photo={user?.image}
                          width={40}
                          height={40}
                          key={user?.id}
                        />
                      );
                    })}
                </div>
                <div className="flex flex-col">
                  <p
                    className={cn(
                      "text-[14px] font-bold text-[#797979]",
                      isSelectedGroup && "text-white hover:text-[#797979]",
                    )}
                  >
                    {group?.name}
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
            const isSelectedUser = !!usersList.find((u) => u.id === user.id);
            return (
              <button
                key={user.id}
                className={cn(
                  `flex items-center gap-2 rounded-md border border-[#006D77] bg-[#F2F2F2] p-2 hover:bg-gray-300 sm:border-0`,
                  isSelectedUser && "bg-[#006D77]",
                )}
                onClick={() => {
                  // add this user to the list (if not already in it)
                  setUsersList((usersList) => {
                    if (usersList.length + groupsList.length >= 4)
                      return usersList;
                    if (usersList.find((u) => u.id === user.id)) {
                      return usersList;
                    }
                    return [...usersList, user];
                  });
                }}
              >
                <Avatar photo={user.image} width={60} height={60} />
                <div className="flex flex-col">
                  <p
                    className={cn(
                      "text-[14px] font-bold text-[#797979]",
                      isSelectedUser && "text-[#F2F2F2] hover:text-[#797979]",
                    )}
                  >
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
