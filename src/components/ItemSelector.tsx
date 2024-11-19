import { cn } from "@/lib/cn";
import { Item } from "@/stores/estimate-create";
import { useEstimatePopupStore } from "@/stores/estimate-popup";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuTrigger } from "./DropdownMenu";

export default function ItemSelector<T>({
  label,
  item,
  list,
  onEdit,
  onDelete,
  onSelect,
  display,
  type,
  alwaysShowDeleteButton,
  materialIndex,
  onSearch,
  dropdownsOpen,
  setDropdownsOpen,
  index,
}: {
  label: string;
  type: "SERVICE" | "MATERIAL" | "LABOR";
  item: Item;
  list: T[];
  display: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: (item: T) => void;
  alwaysShowDeleteButton?: boolean;
  materialIndex?: number;
  onSearch?: (search: string) => T[];
  index: number[];
  dropdownsOpen: any;
  setDropdownsOpen: any;
}) {
  const [open, setOpen] = useState(false);
  const [itemIist, setItemIist] = useState<T[]>(list);
  const [selected, setSelected] = useState<T | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { open: openPopup } = useEstimatePopupStore();

  useEffect(() => {
    if (
      dropdownsOpen[type][0] === index[0] &&
      dropdownsOpen[type][1] === index[1]
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }

    if (onSearch) {
      const results = onSearch("");
      setItemIist(results);
    }
  }, [dropdownsOpen]);

  useEffect(() => {
    setItemIist(list);
  }, [list]);

  useEffect(() => {
    if (type === "LABOR" && item.labor) {
      // @ts-ignore
      setSelected(item.labor);
    }
  }, [item.labor]);

  useEffect(() => {
    if (type === "SERVICE" && item.service) {
      // @ts-ignore
      setSelected(item.service);
    }
  }, [item.service]);

  useEffect(() => {
    if (type === "MATERIAL" && item.materials[materialIndex!]) {
      // @ts-ignore
      setSelected(item.materials[materialIndex!]);
    }
  }, [item.materials]);

  return (
    <div
      onClick={(e) => {
        if (searchRef?.current?.contains(e.target as Node)) {
          return;
        }

        if (
          dropdownsOpen[type][0] === index[0] &&
          dropdownsOpen[type][1] === index[1]
        ) {
          setDropdownsOpen({
            SERVICE: [-1, -1],
            MATERIAL: [-1, -1],
            LABOR: [-1, -1],
            TAG: [-1, -1],
            [type]: [index[0], index[1]],
          });
        } else {
          setDropdownsOpen({
            SERVICE: type === "SERVICE" ? [...index] : [-1, -1],
            MATERIAL: type === "MATERIAL" ? [...index] : [-1, -1],
            LABOR: type === "LABOR" ? [...index] : [-1, -1],
            TAG: [-1, -1],
          });

          // setDropdownsOpen({
          //   SERVICE: type === "SERVICE" ? [...index] : -1,
          //   MATERIAL: type === "MATERIAL" ? [...index] : -1,
          //   LABOR: type === "LABOR" ? [...index] : -1,
          //   TAG: -1,
          // });
        }
      }}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <div className="relative basis-full md:basis-96">
          {/* Delete button */}
          {alwaysShowDeleteButton && !selected && (
            <button
              className="absolute -right-2 -top-2"
              type="button"
              onClick={() => {
                setSelected(null);
                onDelete && onDelete();
              }}
            >
              <div className="rounded-full bg-[#6571FF] p-1 text-white">
                <FaTimes className="text-[10px]" />
              </div>
            </button>
          )}

          {!selected ? (
            <DropdownMenuTrigger
              onClick={() => setOpen(true)}
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border-2 border-slate-400 px-4",
                open && "invisible",
              )}
            >
              <p className="text-sm font-medium text-slate-400">{label}</p>
              <FaChevronDown className="text-[#797979]" />
            </DropdownMenuTrigger>
          ) : (
            <div
              className={cn(
                "relative flex h-10 w-full items-center justify-between rounded-md border-2 border-slate-400 px-4",
              )}
            >
              <p className="text-sm font-medium text-slate-400">
                {
                  // @ts-ignore
                  selected[display]
                }
              </p>

              {/* Edit button */}
              <button
                className="absolute -top-2 right-3"
                type="button"
                onClick={() => {
                  onEdit && onEdit();
                }}
              >
                <div className="rounded-full bg-[#6571FF] p-1 text-white">
                  <FaPen className="text-[10px]" />
                </div>
              </button>

              {/* Delete button */}
              <button
                className="absolute -right-2 -top-2"
                type="button"
                onClick={() => {
                  if (searchRef?.current?.value) searchRef.current.value = "";

                  if (onSearch) {
                    const results = onSearch("");
                    setItemIist(results);
                  }

                  onDelete && onDelete();
                  setSelected(null);
                }}
              >
                <div className="rounded-full bg-[#6571FF] p-1 text-white">
                  <FaTimes className="text-[10px]" />
                </div>
              </button>
            </div>
          )}

          <DropdownMenuContent
            align="start"
            sideOffset={-40}
            className="z-50 w-full rounded-lg border-2 border-slate-400 bg-white"
            style={{ minWidth: "var(--radix-popper-anchor-width)" }}
          >
            {/* Search */}
            <div className="relative m-2">
              <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search"
                className="w-full rounded-md border-2 border-slate-400 p-1 pl-6 pr-10 focus:outline-none"
                onChange={(e) => {
                  if (onSearch) {
                    const search = e.target.value;
                    const results = onSearch(search);
                    setItemIist(results);
                  }
                }}
              />
              <button onClick={() => setOpen(false)}>
                <FaChevronUp className="absolute right-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
              </button>
            </div>

            <div className="mb-5 max-h-[calc(100vh-60vh)] overflow-y-auto">
              {itemIist.slice(0, 4).map((item, i) => (
                <button
                  className="mx-auto my-1 flex w-[95%] cursor-pointer items-center justify-between gap-1 rounded-md border border-[#6571FF] p-1 text-[#6571FF] hover:bg-gray-100"
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    onSelect && onSelect(item);
                    setOpen(false);
                  }}
                >
                  <p className="w-full text-left">
                    {
                      // @ts-ignore
                      item[display]
                    }
                  </p>
                </button>
              ))}
            </div>
            {/* New button */}
            <div className="border-t-2 border-slate-400 p-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPopup(type, {
                    itemId: item.id,
                    materialIndex,
                  });
                  setOpen(false);
                  setDropdownsOpen({
                    SERVICE: [-1, -1],
                    MATERIAL: [-1, -1],
                    LABOR: [-1, -1],
                    TAG: [-1, -1],
                  });
                }}
              >
                + New {label}
              </button>
            </div>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  );
}
