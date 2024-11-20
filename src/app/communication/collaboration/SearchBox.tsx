import { searchCompanyQuery } from "@/actions/communication/collaboration/searchQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { errorToast } from "@/lib/toast";
import { Company, User } from "@prisma/client";
import React, { SetStateAction, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RiArrowUpSLine } from "react-icons/ri";

type TProps = {
  setOpenUserList: React.Dispatch<React.SetStateAction<boolean>>;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;

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
  { setOpenUserList, onSearch }: TProps,
  ref: React.Ref<HTMLInputElement>,
) {
  // const [searchText, setSearchText] = useState("");

  const onChangeInput = useDebounce(onSearch, 300);

  return (
    <div className="relative">
      <input
        ref={ref}
        // value={searchText}
        placeholder="search for a company"
        onChange={onChangeInput}
        type="text"
        className="w-full rounded-sm border border-primary-foreground bg-white py-0.5 pl-7 leading-6 outline-none"
      />
      <RiArrowUpSLine
        onClick={() => setOpenUserList((prev) => !prev)}
        className="absolute right-0 top-[5px] size-6 cursor-pointer"
      />
      <CiSearch className="absolute left-1 top-[5px] size-5 cursor-pointer" />
    </div>
  );
});

export default SearchBox;
