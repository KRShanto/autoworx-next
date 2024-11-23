"use client";
import { cn } from "@/lib/cn";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { IoMdArrowDropdown } from "react-icons/io";
import { TFilterModalState } from "../../(report)/revenue/FilterHeader";
import { useEffect, useRef } from "react";
type TProps = {
  selectedItem: string;
  items: string[];
  type: string;
  modalName: string;
  closeModal: (modalName: string) => void;
  toggleModal: (modalName: string) => void;
  activeModal: TFilterModalState;
};
export default function FilterBySelection({
  selectedItem,
  items,
  type,
  modalName,
  closeModal,
  activeModal,
  toggleModal,
}: TProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  // const [show, setShow] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeModal(modalName);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelection = (value: string) => {
    const searchParams = new URLSearchParams(params);
    searchParams.set(type, value);
    const newPath = `${pathname}?${searchParams.toString()}`;
    router.push(newPath);
    closeModal(modalName);
  };

  const handleClear = () => {
    const searchParams = new URLSearchParams(params);
    searchParams.delete(type);
    const newPath = `${pathname}?${searchParams.toString()}`;
    router.replace(newPath);
    closeModal(modalName);
  };
  return (
    <div>
      <button
        ref={buttonRef}
        onClick={() => toggleModal(modalName)}
        className={cn(
          `flex w-44 items-center justify-center gap-2 border border-gray-400 p-1 px-5 text-sm text-gray-400 hover:border-blue-600`,
          activeModal ? "rounded-tl-sm rounded-tr-sm" : "rounded-sm",
        )}
      >
        <span>{selectedItem ? selectedItem : type}</span>
        <IoMdArrowDropdown />
      </button>
      {activeModal[modalName as keyof TFilterModalState] && (
        <div
          ref={dropdownRef}
          className="absolute flex max-h-52 w-44 flex-col space-y-1 overflow-y-auto rounded-bl-sm rounded-br-sm border border-t-0 border-gray-400 bg-white p-3 hover:z-10"
        >
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
          <button
            onClick={handleClear}
            className="mt-1 border-t text-sm hover:text-red-500"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
