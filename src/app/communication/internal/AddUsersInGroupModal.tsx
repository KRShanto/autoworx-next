import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import { SlimInput } from "@/components/SlimInput";
import React, { useEffect, useRef, useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { TiDeleteOutline, TiPlusOutline } from "react-icons/ti";
import { User } from "@prisma/client";
import Avatar from "@/components/Avatar";
import { useDebounce } from "@/hooks/useDebounce";
import { searchUsers } from "@/actions/communication/internal/searchUser";
import { addUserInGroup } from "@/actions/communication/internal/addUserInGroup";

type TProps = {
  users: User[];
  groupId: number | undefined;
  setGroupsList: React.Dispatch<React.SetStateAction<any[]>> | null;
};

type TContactListUser = {
  id: number;
  name: string;
};

export default function AddUsersInGroupModal({
  users,
  groupId,
  setGroupsList,
}: TProps) {
  const [groupUsers, setGroupUsers] = useState(users);

  const [open, setOpen] = useState(false);

  const [openUserList, setOpenUserList] = useState(false);

  const [contactList, setContactList] = useState<Array<TContactListUser>>([]);

  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, [openUserList]);

  useEffect(() => {
    if (!open) {
      setContactList([]);
      setGroupUsers([]);
      setOpenUserList(false);
      setError(null);
    }
  }, [open]);

  const getFindUsers = async (searchTerm?: string) => {
    const withoutContactList = contactList.map((user) => ({
      id: user.id,
    }));
    const alreadyAddedUsersInGroup = users.map((user) => ({
      id: user.id,
    }));
    const searchUsersResult = await searchUsers(
      searchTerm || "",
      withoutContactList.concat(alreadyAddedUsersInGroup),
    );
    if (searchUsersResult.success) {
      setGroupUsers(searchUsersResult.data);
    } else {
      setGroupUsers(users);
    }
  };

  // search user handler
  const handleSearch = useDebounce(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = event.target.value;
      getFindUsers(searchTerm);
    },
    500,
  );

  // add user in contact list
  const handleAddContactList = (user: User) => {
    const modifyUser = {
      id: user.id,
      name: user.firstName + " " + user.lastName,
    };
    setGroupUsers((prevContact) =>
      prevContact.filter((prevUser) => prevUser.id !== user.id),
    );

    setError(null);
    setContactList((prev) => [...prev, modifyUser]);
    setOpenUserList(false);
  };

  const handleDeleteFromContactList = (user: TContactListUser) => {
    setGroupUsers((prevUser) => [
      ...prevUser,
      users.find((u) => u.id === user.id)!,
    ]);
    setContactList((prev) =>
      prev.filter((prevUser) => prevUser.id !== user.id),
    );
  };

  const handleAddUserInGroup = async () => {
    if (contactList.length !== 0 && groupId) {
      const usersInGroup = contactList.map((user) => ({
        id: user.id,
      }));
      const response = await addUserInGroup({
        groupId,
        users: usersInGroup,
      });
      if (response.status === 200) {
        setOpen(false);
        setError("");
        setContactList([]);
        setGroupsList &&
          setGroupsList((groupList) =>
            groupList.map((g) => {
              if (g.id === groupId) {
                return response.data;
              }
              return g;
            }),
          );
      } else {
        setError("Failed to create group.");
      }
    } else {
      setError("At least 2 users are required to create a group.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex cursor-pointer items-center justify-between space-x-1 rounded-full border-2 border-[#006D77] px-2 py-1 text-white">
          <p className="text-sm text-[#006D77]">Add Users</p>
          <TiPlusOutline className="size-5 text-[#006D77]" />
        </button>
      </DialogTrigger>
      <DialogContent className="w-[350px] sm:w-full">
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <h2 className="mb-5 text-2xl font-bold">Add Users</h2>
        <div>
          {openUserList ? (
            <>
              <div className="mb-1 px-2 font-medium">Contact List</div>
              <div className="h-fit w-full space-y-4 rounded-md border border-gray-500 p-4">
                {/* Search box */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    onChange={handleSearch}
                    type="text"
                    className="w-full rounded-sm border border-primary-foreground bg-white py-0.5 pl-7 leading-6 outline-none"
                  />
                  <RiArrowUpSLine
                    onClick={() => setOpenUserList((prev) => !prev)}
                    className="absolute right-0 top-[5px] size-6 cursor-pointer"
                  />
                  <CiSearch className="absolute left-1 top-[5px] size-5 cursor-pointer" />
                </div>
                {/* user list */}
                <div className="flex h-72 flex-col items-start space-y-2 overflow-y-auto p-1">
                  {groupUsers.length > 0 ? (
                    groupUsers.map((user) => (
                      <div
                        key={user?.id}
                        className="flex cursor-pointer items-center space-x-2 p-1"
                        onClick={() => handleAddContactList(user)}
                      >
                        <Avatar photo={user?.image} width={60} height={60} />
                        <div className="flex flex-col overflow-hidden">
                          <p className="text-sm font-bold">
                            {user?.firstName} {user?.lastName}
                          </p>

                          <div className="flex items-center space-x-3 text-[10px]">
                            {user?.phone && <p>{user?.phone}</p>}
                            <p>{user?.email}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="w-full text-center text-red-300">
                      No user found
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="relative">
              <SlimInput
                label="Contact List"
                name="ContactList"
                type="text"
                readOnly
                onClick={() => {
                  setOpenUserList((prev) => !prev);
                  getFindUsers();
                }}
                className="cursor-pointer"
              />
              <RiArrowDownSLine
                onClick={() => {
                  setOpenUserList((prev) => !prev);
                  getFindUsers();
                }}
                className="absolute right-1 top-[32px] size-6 cursor-pointer"
              />
              {/* added user in group */}
              <div className="mt-3 flex flex-wrap gap-3">
                {contactList.map((groupUser) => (
                  <div
                    key={groupUser.id}
                    className="flex items-center justify-between space-x-1 rounded-full bg-[#006D77] px-2 py-1 text-white"
                  >
                    <p className="text-sm">{groupUser.name}</p>
                    <TiDeleteOutline
                      onClick={() => handleDeleteFromContactList(groupUser)}
                      className="size-5 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex-row-reverse gap-x-2 sm:gap-x-0">
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button
            onClick={handleAddUserInGroup}
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
          >
            Add
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
