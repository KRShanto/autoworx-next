import Avatar from "@/components/Avatar";
import { User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type TProps = {
  companyUsers: User[];
  onlyOneUser?: boolean;
  assignedUsers: number[];
  setAssignedUsers: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function AssignTaskDropDown({
  companyUsers,
  onlyOneUser,
  assignedUsers,
  setAssignedUsers,
}: TProps) {
  const [users, setUsers] = useState(companyUsers);
  const [showUsers, setShowUsers] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userDivRef = useRef<HTMLDivElement>(null);
  const handleTrigger = () => {
    setShowUsers(!showUsers);
  };

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (showUsers) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [showUsers]);

  useEffect(() => {
    return () => {
      setAssignedUsers([]);
    };
  }, []);

  const handleRemoveUser = (userId: number) => {
    const findUser = companyUsers.find((user) => user.id === userId);
    setUsers((prevUsers) => prevUsers.concat(findUser as User));
    setAssignedUsers((prevAssignUserId) =>
      prevAssignUserId.filter((id) => id !== userId),
    );
  };
  return (
    <>
      <div className="mb-4 flex flex-col">
        <label htmlFor="assigned_users">Assign</label>
        <div className="no-visible-scrollbar my-2 flex max-h-40 flex-wrap items-center gap-1 overflow-y-auto">
          {assignedUsers.map((userId) => {
            const userInfo = companyUsers.find((user) => user.id === userId);
            const fullName = userInfo?.firstName + " " + userInfo?.lastName;
            return (
              <div
                key={userId}
                className={cn(
                  //   buttonVariants({ variant: "outline" }),
                  "flex items-center gap-x-2 rounded-sm border px-3 py-2 shadow-md",
                )}
              >
                <span>{fullName}</span>
                <TiDeleteOutline
                  onClick={() => handleRemoveUser(userId)}
                  className="size-6 flex-shrink-0 cursor-pointer text-red-300"
                />
              </div>
            );
          })}
        </div>

        {!onlyOneUser && showUsers ? (
          <div className="relative">
            <input
              ref={inputRef}
              onChange={(event) => setSearchTerm(event.target.value)}
              onBlur={() => {
                if (users.length === 0) {
                  setShowUsers(false);
                }
              }}
              type="text"
              placeholder="search users"
              name="searchUsers"
              className="flex w-full items-center justify-end rounded-md border-2 border-gray-500 p-2"
            />
            {users.length > 0 && (
              <div
                ref={userDivRef}
                className={cn(
                  "no-visible-scrollbar mt-2 flex max-h-56 w-[460px] flex-col gap-2 overflow-y-auto p-2 font-bold",
                  "absolute top-[45px] z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                  "p-3",
                )}
              >
                {users
                  .filter((user) => {
                    const fullName = user.firstName + " " + user.lastName;
                    return fullName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  })
                  .map((user) => (
                    <label
                      htmlFor={user.id.toString()}
                      key={user.id}
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => {
                        setAssignedUsers([...assignedUsers, user.id]);
                        setUsers((prevUser) =>
                          prevUser.filter((u) => user.id !== u.id),
                        );
                      }}
                    >
                      <Avatar photo={user.image} width={40} height={40} />
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </label>
                  ))}
                <button
                  onClick={() => setShowUsers(false)}
                  type="button"
                  className="absolute right-2 top-2"
                >
                  <TiDeleteOutline size={30} className="text-red-300" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleTrigger}
            variant="outline"
            className="flex w-full items-center justify-end rounded-md border-2 border-gray-500 p-2"
          >
            {showUsers ? (
              <FaChevronUp className="text-[#797979]" />
            ) : (
              <FaChevronDown className="text-[#797979]" />
            )}
          </Button>
        )}
      </div>
    </>
  );
}
