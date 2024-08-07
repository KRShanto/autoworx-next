import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";

interface SelectorProps<T> {
  label: (item: T | null) => string;
  items: T[];
  displayList: (item: T) => JSX.Element;
  onSearch?: (search: string) => T[];
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  selectedItem?: T | null | undefined;
  setSelectedItem?: React.Dispatch<React.SetStateAction<T | null>>;
  clickabled?: boolean;
  disabledDropdown?: boolean;
  dropdownWidth?: string; // New prop for setting dropdown width
}

export default function Selector<T>({
  label,
  items,
  displayList,
  onSearch,
  openState,
  selectedItem,
  setSelectedItem,
  clickabled = true,
  disabledDropdown = false,
  dropdownWidth = "183px", // Default to 100%
}: SelectorProps<T>): JSX.Element {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isOpen, setIsOpen] = openState || useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [selected, setSelected] = useState<T | null | undefined>(selectedItem);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    setSelected(selectedItem);
  }, [selectedItem]);

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    if (onSearch) {
      const searchQuery = e.target.value;
      const searchResults = onSearch(searchQuery);
      setFilteredItems(searchResults);
    }
  }

  function handleSelectItem(item: T) {
    setSelected(item);
    if (setSelectedItem) setSelectedItem(item);
    setIsOpen(false);
  }

  function handleCloseDropdown() {
    setIsOpen(false);
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className=" basis-full md:basis-96 ">
        <DropdownMenuTrigger
          disabled={disabledDropdown}
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-full items-center justify-between  "
        >
         
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={-40}
          className="z-50 rounded-lg border-2 border-slate-400 bg-white"
          style={{
            width: dropdownWidth, 
          }}
        >
          <div className="relative m-2">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border-2 border-slate-400 p-1 pl-6 pr-10 focus:outline-none"
              onChange={handleSearchChange}
            />
            <button onClick={handleCloseDropdown}>
              <FaChevronUp className="absolute right-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
            </button>
          </div>

          <div className="mb-5 max-h-16 overflow-y-auto">
            {filteredItems.map((item, index) => (
              <button
                onClick={() => handleSelectItem(item)}
                type="button"
                key={index}
                className="w-full p-1 px-2 text-left hover:bg-gray-100"
              >
                {displayList(item)}
              </button>
            ))}
          </div>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
