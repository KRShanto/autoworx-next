import { User } from "@prisma/client";
import Image from "next/image";

export default function List({
  users,
  setUsersList,
}: {
  users: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
}) {
  return (
    <div className="app-shadow h-[83vh] w-[20%] rounded-lg bg-white p-3">
      {/* Header */}
      <h2 className="text-[14px] text-[#797979]">User List</h2>

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

      {/* List */}
      <div className="mt-2 flex h-[88%] flex-col gap-2 overflow-y-auto max-[2127px]:h-[80%]">
        {users.map((user) => {
          return (
            <button
              key={user.id}
              className="flex items-center gap-2 rounded-md bg-[#F2F2F2] p-2"
              onClick={() => {
                // add this user to the list (if not already in it)
                setUsersList((usersList) => {
                  if (usersList.find((u) => u.id === user.id)) {
                    return usersList;
                  }
                  return [...usersList, user];
                });
              }}
            >
              <Image
                src={user.image}
                alt={user.name}
                // className="h-[60px] w-[60px] rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
                width={60}
                height={60}
                className="rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
              />
              <div className="flex flex-col">
                <p className="text-[14px] font-bold text-[#797979]">
                  {user.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
