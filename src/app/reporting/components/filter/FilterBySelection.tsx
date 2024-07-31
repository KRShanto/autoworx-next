"use client";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
type TProps = {
  selectedItem: string;
  items: string[];
  type: string;
};
export default function FilterBySelection({
  selectedItem,
  items,
  type,
}: TProps) {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const handleSelection = (value: string) => {
    const searchParams = new URLSearchParams(params);
    searchParams.set(type, value);
    const newPath = `${pathname}?${searchParams.toString()}`;
    router.push(newPath);
    setShow(false);
  };
  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className={cn(
          `flex w-44 items-center justify-center gap-2 border border-gray-400 p-1 px-5 text-sm text-gray-400 hover:border-blue-600`,
          show ? "rounded-tl-lg rounded-tr-lg" : "rounded-lg",
        )}
      >
        <span>{selectedItem ? selectedItem : type}</span>
        <IoMdArrowDropdown />
      </button>
      {show && (
        <div className="absolute flex max-h-52 w-44 flex-col space-y-1 overflow-y-auto rounded-bl-lg rounded-br-lg border border-t-0 border-gray-400 bg-white p-3">
          {items.map((item) => (
            <button
              onClick={() => handleSelection(item)}
              key={item}
              className={`text-md flex items-center gap-2 hover:text-blue-600 ${
                item === selectedItem ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
