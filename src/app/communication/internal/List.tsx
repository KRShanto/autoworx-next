import { Group, User } from "@prisma/client";
import Image from "next/image";
import CreateGroupModal from "./CreateGroupModal";

export default function List({
  users,
  setUsersList,
  groups,
}: {
  users: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  groups: (Group & { users: User[] })[];
}) {
  return (
    <div className="app-shadow w-[20%] rounded-lg bg-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] text-[#797979]">User List</h2>
        <CreateGroupModal users={users} />
      </div>
      {/* Search */}
      <form>
        <input
          type="text"
          placeholder="Search here..."
          className="my-3 mr-2 rounded-md border-none p-2 text-[12px] text-[#797979] max-[1822px]:w-full"
        />
        <button
          type="submit"
          className="h-[26px] w-[62px] rounded-md bg-[#797979] text-[12px] text-white"
        >
          Filter
        </button>
      </form>
      <div className="mt-2 flex h-[88%] flex-col gap-2 overflow-y-auto max-[2127px]:h-[80%]">
        {/* Group list */}
        {groups.map((group) => {
          return (
            <button
              key={group.id}
              className="flex items-center gap-2 rounded-md bg-[#F2F2F2] p-2"
              // onClick={() => {
              //   // add this user to the list (if not already in it)
              //   setUsersList((usersList) => {
              //     if (usersList.length >= 4) return usersList;
              //     if (usersList.find((u) => u.id === user.id)) {
              //       return usersList;
              //     }
              //     return [...usersList, user];
              //   });
              // }}
            >
              <div className="grid grid-cols-2">
                {group.users.map((user) => {
                  return (
                    <Image
                      key={user.id}
                      src={user.image}
                      alt="User image"
                      // className="h-[60px] w-[60px] rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
                      width={30}
                      height={30}
                      className="rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
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
        {users.map((user) => {
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
              <Image
                src={user.image}
                alt="User image"
                // className="h-[60px] w-[60px] rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
                width={60}
                height={60}
                className="rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
              />
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
