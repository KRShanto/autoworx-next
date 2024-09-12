import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import { SlimInput } from "@/components/SlimInput";
import { useEffect, useRef, useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { TiDeleteOutline } from "react-icons/ti";
import { User } from "@prisma/client";
import { createGroup } from "@/actions/communication/internal/creategroup";
import { useSession } from "next-auth/react";
import Avatar from "@/components/Avatar";

type TProps = {
  users: User[];
};

type TContactListUser = {
  id: number;
  name: string;
};

export default function CreateGroupModal({ users }: TProps) {
  const [groupUsers, setGroupUsers] = useState(users);

  const { data: session }: { data: any } = useSession();

  const [open, setOpen] = useState(false);

  const [openUserList, setOpenUserList] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [groupName, setGroupName] = useState("");

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
      setGroupName("");
      setGroupUsers(users);
      setOpenUserList(false);
      setError(null);
    }
  }, [open]);

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

  async function handleCreateGroup() {
    if (contactList.length >= 2) {
      const usersInGroup = contactList.map((user) => ({
        id: user.id,
      }));
      const group = await createGroup({
        name: groupName,
        users: [{ id: session?.user.id }, ...usersInGroup],
      });
      if (group.status === 200) {
        setOpen(false);
        setError("");
        setGroupName("");
        setContactList([]);
      } else {
        setError("Failed to create group.");
      }
    } else {
      setError("At least 2 users are required to create a group.");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-md bg-[#006D77] px-2 py-0.5">
          <MdGroupAdd className="size-5 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent>
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <h2 className="mb-5 text-2xl font-bold">Create Group</h2>
        <div className="grid grid-cols-1">
          {/* group name */}
          <SlimInput
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            label="Group name"
            name="groupName"
            type="text"
          />
        </div>
        <div>
          {openUserList ? (
            <>
              <div className="mb-1 px-2 font-medium">Contact List</div>
              <div className="h-fit w-full space-y-4 rounded-md border border-gray-500 p-4">
                {/* Search box */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
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
                  {groupUsers
                    .filter(
                      (user) =>
                        user.firstName
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        user.lastName
                          ?.toLowerCase()
                          ?.includes(searchText.toLowerCase()),
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex cursor-pointer items-center space-x-2 p-1"
                        onClick={() => handleAddContactList(user)}
                      >
                        <Avatar photo={user.image} width={60} height={60} />
                        <div className="flex flex-col overflow-hidden">
                          <p className="text-sm font-bold">
                            {user.firstName} {user.lastName}
                          </p>

                          <div className="flex items-center space-x-3 text-[10px]">
                            {user.phone && <p>{user.phone}</p>}
                            <p>{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
                onClick={() => setOpenUserList((prev) => !prev)}
              />
              <RiArrowDownSLine
                onClick={() => setOpenUserList((prev) => !prev)}
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
        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button
            onClick={handleCreateGroup}
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
          >
            Add
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
