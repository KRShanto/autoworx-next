import React, { useState } from "react";
import { tempCompanies } from "@/lib/tempCompanies";
import Image from "next/image";

export default function List({
  setSelectedUsersList,
}: {
  setSelectedUsersList: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [selectedCompany, setSelectedCompany] = useState<any>(null); // TODO: type this

  return (
    <div className="app-shadow h-[83vh] w-[23%] rounded-lg bg-white p-3">
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
      <div className="mt-2 flex h-[88%] flex-col gap-1 overflow-y-auto max-[2127px]:h-[80%]">
        {tempCompanies.map((company) => {
          if (selectedCompany && selectedCompany.id === company.id) {
            return (
              <div key={company.id} className="rounded-lg bg-[#006D77] p-2">
                <button
                  className="flex w-full items-center justify-center gap-1"
                  onClick={() => setSelectedCompany(null)}
                >
                  <Image
                    src={company.image}
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
                  {company.users.map((user: any) => {
                    return (
                      <button
                        key={user.id}
                        className="flex w-full items-center gap-2 rounded-md bg-[#F2F2F2] p-1"
                        onClick={() => {
                          // add this user to the list (if not already in it)
                          setSelectedUsersList((usersList) => {
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
                          width={50}
                          height={50}
                          className="rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
                        />
                        <div className="flex flex-col">
                          <p className="text-[12px] font-bold text-[#797979]">
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

          return (
            <button
              key={company.id}
              className="flex items-center gap-2 rounded-md bg-[#F2F2F2] p-2"
              onClick={() => setSelectedCompany(company)}
            >
              <Image
                src={company.image}
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
