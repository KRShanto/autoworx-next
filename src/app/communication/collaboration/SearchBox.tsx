import { searchCompanyQuery } from "@/actions/communication/collaboration/searchQuery";
import { errorToast } from "@/lib/toast";
import { Company, User } from "@prisma/client";
import React, { SetStateAction, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RiArrowUpSLine } from "react-icons/ri";

type TProps = {
  setOpenUserList: React.Dispatch<React.SetStateAction<boolean>>;

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

const SearchBox = React.forwardRef(function SearchBox(
  { setOpenUserList, companies, setCompanyAdmins }: TProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const [searchText, setSearchText] = useState("");
  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event && event.preventDefault();
    try {
      const response = await searchCompanyQuery(searchText);
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
  };
  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        ref={ref}
        value={searchText}
        onChange={(e) => {
          if (e.target.value === "") {
            handleSubmit();
          }
          setSearchText(e.target.value);
        }}
        type="text"
        className="w-full rounded-sm border border-primary-foreground bg-white py-0.5 pl-7 leading-6 outline-none"
      />
      <RiArrowUpSLine
        onClick={() => setOpenUserList((prev) => !prev)}
        className="absolute right-0 top-[5px] size-6 cursor-pointer"
      />
      <CiSearch className="absolute left-1 top-[5px] size-5 cursor-pointer" />
    </form>
  );
});

export default SearchBox;
