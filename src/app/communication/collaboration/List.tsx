import React, { useState } from "react";
import Image from "next/image";
import { Company, User } from "@prisma/client";
import SearchCollaborationModal from "./SearchCollaborationModal";
import { cn } from "@/lib/cn";

type TProps = {
  companyAdmins: Partial<User>[];
  setCompanyAdmins: React.Dispatch<React.SetStateAction<Partial<User>[]>>;
  setSelectedUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  companies: (Company & { users: User[] })[];
  selectedUsersList: User[];
};

export default function List({
  selectedUsersList,
  companyAdmins,
  setSelectedUsersList,
  companies,
  setCompanyAdmins,
}: TProps) {
  const [selectedCompany, setSelectedCompany] = useState<any>(null); // TODO: type this
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="app-shadow h-[83vh] w-[23%] rounded-lg bg-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] text-[#797979]">User List</h2>
        <SearchCollaborationModal
          companies={companies}
          setCompanyAdmins={setCompanyAdmins}
          companyAdmins={companyAdmins}
        />
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const searchTerm = formData.get("searchTerm") as string;
          setSearchTerm(searchTerm);
        }}
      >
        <input
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          type="text"
          placeholder="Search here... company name or admin name"
          name="searchTerm"
          className="my-3 mr-2 w-full rounded-md border-2 border-[#006D77] p-2 text-[12px] text-[#797979] max-[1822px]:w-full"
        />
      </form>

      {/* List */}
      <div className="mt-2 flex h-[88%] flex-col gap-1 overflow-y-auto max-[2127px]:h-[80%]">
        {companies
          .filter((company) => {
            return (
              company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              company.users.some((user) => {
                const fullName = `${user.firstName} ${user.lastName}`;
                return (
                  fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
            );
          })
          .map((company) => {
            if (selectedCompany && selectedCompany.id === company.id) {
              return (
                <div key={company.id} className="rounded-lg bg-[#006D77] p-2">
                  <button
                    className="flex h-[78px] w-full items-center justify-start gap-1"
                    onClick={() => setSelectedCompany(null)}
                  >
                    <Image
                      src={
                        company.image ? company.image : "/icons/business.png"
                      }
                      alt={company.name}
                      width={50}
                      height={50}
                      className="rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
                    />

                    <p className="text-[12px] font-bold text-white">
                      {company.name}
                    </p>
                  </button>

                  <div className="flex flex-col items-center gap-1">
                    {company.users.map((user: User) => {
                      const isSelectedUser = !!selectedUsersList.find(
                        (u) => u.id === user.id,
                      );
                      return (
                        <button
                          key={user.id}
                          className={cn(
                            "flex min-h-[61px] w-full items-center gap-2 rounded-md bg-[#F2F2F2] p-1 hover:bg-gray-300",
                            isSelectedUser && "bg-[#2C2C54] hover:bg-stone-400",
                          )}
                          onClick={() => {
                            // add this user to the list (if not already in it)
                            setSelectedUsersList((usersList) => {
                              if (usersList.length >= 4) return usersList;
                              if (usersList.find((u) => u.id === user.id)) {
                                return usersList;
                              }
                              return [
                                ...usersList,
                                { ...user, companyName: company.name },
                              ];
                            });
                          }}
                        >
                          <Image
                            src={
                              user.image?.includes("default.png")
                                ? user.image
                                : user.image
                            }
                            alt={user.firstName}
                            width={50}
                            height={50}
                            className="rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
                          />
                          <div className="flex flex-col">
                            <p
                              className={cn(
                                "text-[12px] font-bold text-[#797979]",
                                isSelectedUser && "text-white",
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

            return (
              <button
                key={company.id}
                className="flex items-center gap-2 rounded-md bg-[#F2F2F2] p-2"
                onClick={() => setSelectedCompany(company)}
              >
                <Image
                  src={company.image ? company.image : "/icons/business.png"}
                  alt={company.name}
                  width={50}
                  height={50}
                  className="rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
                />

                <p className="text-[12px] font-bold text-[#797979]">
                  {company.name}
                </p>
              </button>
            );
          })}
      </div>
    </div>
  );
}
