import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import { SlimInput } from "@/components/SlimInput";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { Company, User } from "@prisma/client";
import Avatar from "@/components/Avatar";
import { FaPlus } from "react-icons/fa";
import { errorToast, successToast } from "@/lib/toast";
import { connectWithCompany } from "@/actions/settings/myNetwork";
import SearchBox from "./SearchBox";
import { searchCompanyQuery } from "@/actions/communication/collaboration/searchQuery";

type TProps = {
  companyAdmins: Partial<
    User & {
      isConnected: boolean;
    }
  >[];
  setCompanyAdmins: React.Dispatch<
    SetStateAction<
      Partial<
        User & {
          isConnected: boolean;
        }
      >[]
    >
  >;
  companies: (Company & { users: User[] })[];
};

export default function SearchCollaborationModal({
  companyAdmins,
  setCompanyAdmins,
  companies,
}: TProps) {
  const [open, setOpen] = useState(false);

  const [openUserList, setOpenUserList] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setOpenUserList(false);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
      handleSubmit();
    }
  }, [openUserList]);

  async function handleConnectCompany(companyId: number) {
    try {
      const result = await connectWithCompany(
        companyId,
        "/communication/collaboration", // path revalidated
      );
      // @ts-ignore
      setCompanyAdmins((prevAdmin) => {
        return prevAdmin.map((admin) => {
          if (admin.companyId === companyId) {
            return { ...admin, isConnected: true };
          } else {
            return admin;
          }
        });
      });
      if (result.success) {
        successToast("Connected with the company");
      } else {
        errorToast(result.message);
      }
    } catch (err: any) {
      setError(err.message);
      errorToast(err.message);
    }
  }

  async function handleSubmit(event?: React.ChangeEvent<HTMLInputElement>) {
    // event && event.preventDefault();
    try {
      const inputValue = event?.target?.value || "";
      const response = await searchCompanyQuery(inputValue?.trim());
      if (response.success) {
        const updateCompanyAdmins = response.data
          .map((company) => {
            return company.users.map((user) => {
              return {
                ...user,
                companyName: company.name,
                isConnected: companies.some((c) => c.id === user.companyId),
              };
            });
          })
          .flat();
        setCompanyAdmins(updateCompanyAdmins);
      }
    } catch (err: any) {
      errorToast(err.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-md bg-[#006D77] px-1 py-1 text-[14px] text-white shadow-md">
          Search for Collabortors
        </button>
      </DialogTrigger>
      <DialogContent className="w-96 sm:w-full">
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <h2 className="mb-5 text-2xl font-bold">Search for Collaborators</h2>
        <div>
          {openUserList ? (
            <>
              <div className="mb-1 px-2 font-medium">Enter Company Name</div>
              <div className="h-fit w-full space-y-4 rounded-md border border-gray-500 p-4">
                {/* Search box */}
                <SearchBox
                  onSearch={handleSubmit}
                  setCompanyAdmins={setCompanyAdmins}
                  companies={companies}
                  ref={inputRef}
                  setOpenUserList={setOpenUserList}
                />
                {/* user list */}
                <div className="flex h-72 flex-col items-start space-y-2 overflow-y-auto p-1">
                  {companyAdmins &&
                    companyAdmins?.length > 0 &&
                    companyAdmins.map((user) => (
                      <div
                        key={user?.id}
                        className="flex w-full cursor-pointer items-center justify-between space-x-2 p-1"
                      >
                        <Avatar
                          className="flex-shrink-0"
                          photo={user?.image}
                          width={60}
                          height={60}
                        />
                        <div className="flex w-full flex-wrap items-start gap-x-4 overflow-hidden">
                          <div className="mb-1 flex flex-col items-start">
                            <p className="text-sm font-bold text-[#797979]">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <div className="flex items-center text-[10px]">
                              {user?.phone && <p>{user?.phone}</p>}
                              <p>{user?.email}</p>
                            </div>
                          </div>
                          <p className="flex-shrink-0 text-sm font-bold capitalize text-[#006D77]">
                            {user?.companyName}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {!user?.isConnected && (
                            <button
                              onClick={() =>
                                handleConnectCompany(user?.companyId!)
                              }
                              className="flex items-center space-x-1 rounded-md bg-[#006D77] px-1 py-1 text-[14px] text-white shadow-md"
                            >
                              <FaPlus size={8} />
                              <span className="text-sm">Send Invite</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="relative">
              <SlimInput
                label="Enter Company Name"
                name="ContactList"
                type="text"
                readOnly
                onClick={() => {
                  setOpenUserList((prev) => !prev);
                }}
              />
              <RiArrowDownSLine
                onClick={() => setOpenUserList((prev) => !prev)}
                className="absolute right-1 top-[32px] size-6 cursor-pointer"
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex-row-reverse sm:flex-row gap-x-2 sm:gap-x-0">
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button
            onClick={() => {
              setOpen(false);
              setOpenUserList(false);
            }}
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
