"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
type TProps = {
  searchText: string;
};
export default function FilterBySearchBox({ searchText }: TProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  useEffect(() => {
    if (searchText) {
      setSearchTerm(searchText);
    }
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const searchParams = new URLSearchParams(params);
    if (searchTerm === "") {
      searchParams.delete("search");
    } else {
      searchParams.set("search", searchTerm);
    }
    const newPath = `${pathname}?${searchParams.toString()}`;
    router.replace(newPath);
  };
  const handleSearchChange = useDebounce(handleInputChange, 500);
  return (
    <div className="relative min-w-[693px]">
      <CiSearch className="absolute left-[10px] top-[9px]" />
      <input
        onChange={(e) => {
          handleSearchChange(e);
          setSearchTerm(e.target.value);
        }}
        value={searchTerm}
        className="w-full rounded-md border py-1 pl-8 focus:outline-none"
        type="text"
        placeholder="search"
      />
    </div>
  );
}
