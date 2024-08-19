"use client";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type TProps = {
  dropDownItems: string[];
  width?: number;
  height?: number;
  selected?: string;
  setSelected?: React.Dispatch<React.SetStateAction<string>>;
};

export default function MenuDropDown({
  dropDownItems,
  width,
  height,
  selected,
  setSelected,
}: TProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          type="button"
          className={
            "inline-flex items-center justify-between gap-x-1.5 rounded-sm bg-white px-3 py-2 text-sm text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          }
          style={{
            width: width ? `${width}px` : "auto",
            height: height ? `${height}px` : "auto",
          }}
        >
          {selected}
          <MdKeyboardArrowDown className="size-5 text-gray-400" />
        </button>
      </div>
      {open && (
        <div
          className={
            "absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          }
          style={{
            width: width ? `${width}px` : "auto",
          }}
        >
          <div className="py-1">
            {dropDownItems.map((item) => (
              <button
                onClick={() => {
                  setSelected && setSelected(item);
                  setOpen(false);
                }}
                key={item}
                className="block w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-300"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
