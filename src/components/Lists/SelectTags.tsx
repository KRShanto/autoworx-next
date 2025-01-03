"use client";

import newTag from "@/actions/tag/newTag";
import useOutsideClick from "@/hooks/useOutsideClick";
import { INVOICE_COLORS } from "@/lib/consts";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { Tag } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronUp, FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { HiXCircle } from "react-icons/hi2";
import { PiPaletteBold } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "../DropdownMenu";
import FormError from "../FormError";
import Submit from "../Submit";
import { SelectProps } from "./select-props";
type SelectedColor = { textColor: string; bgColor: string } | null;

export function SelectTags({
  name = "tagIds",
  value = [],
  setValue,
  dropdownsOpen = {},
  setDropdownsOpen,
  index = [-1, -1],
  type,
  openStates,
}: SelectProps<Tag[]>) {
  const state = useState(value);
  const [tags, setTags] = setValue ? [value, setValue] : state;
  const tagIds = useMemo(() => new Set(tags.map((x) => x.id)), [tags]);
  const tagList = useListsStore((x) => x.tags);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = openStates || useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<SelectedColor>(null);

  useOutsideClick(() => {
    setOpen(false);
  });

  useEffect(() => {
    if (type) {
      if (
        dropdownsOpen[type][0] === index[0] &&
        dropdownsOpen[type][1] === index[1]
      ) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [dropdownsOpen]);

  return (
    <div className="flex flex-col">
      <input
        type="hidden"
        name={name}
        value={tags.map((x) => x.id).join(",")}
      />
      <DropdownMenu
        open={open}
        onOpenChange={(open) => {
          // !open && setOpen && setOpen(open);
        }}
      >
        {tags.map((tag, i) => (
          <div
            key={tag.id}
            className="relative mb-1 rounded px-2 text-sm"
            style={{
              backgroundColor: tag.bgColor,
              color: tag.textColor,
            }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => {
                setTags((tags) => tags.toSpliced(i, 1));
              }}
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 text-[#6470FF]"
            >
              <HiXCircle />
            </button>
          </div>
        ))}
        <DropdownMenuTrigger
          // onClick={() => {
          //   setOpen && setOpen(!open);
          // }}
          onClick={() => {
            setOpen && setOpen(!open);
            if (setDropdownsOpen) {
              if (
                type &&
                dropdownsOpen[type][0] === index[0] &&
                dropdownsOpen[type][1] === index[1]
              ) {
                setDropdownsOpen({
                  SERVICE: [-1, -1],
                  MATERIAL: [-1, -1],
                  LABOR: [-1, -1],
                  TAG: [-1, -1],
                });
              } else {
                setDropdownsOpen({
                  SERVICE: type === "SERVICE" ? [...index] : [-1, -1],
                  MATERIAL: type === "MATERIAL" ? [...index] : [-1, -1],
                  LABOR: type === "LABOR" ? [...index] : [-1, -1],
                  TAG: type === "TAG" ? [...index] : [-1, -1],
                });
              }
            }
          }}
          className="flex min-h-10 w-full items-center justify-between rounded-md border-2 border-slate-400 px-4"
        >
          <p className="text-sm font-medium text-slate-400">Tags</p>
          <FaChevronDown className="text-[#797979]" />
        </DropdownMenuTrigger>
        {/* <div> */}
        <DropdownMenuPortal>
          <DropdownMenuContent
            side="bottom"
            align="start"
            sideOffset={8}
            className="ll space-y-1 p-0"
          >
            <DropdownMenuGroup className="">
              {" "}
              {/* Search */}
              <div className="relative m-2">
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-md border-2 border-slate-400 p-1 pl-6 pr-10 focus:outline-none"
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <button onClick={() => setOpen && setOpen(false)}>
                  <FaChevronUp className="absolute right-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
                </button>
              </div>
              <div className="max-h-[calc(100vh-60vh)] space-y-1 overflow-y-scroll">
                {tagList
                  .filter((x) => !tagIds.has(x.id))
                  .map((tag) => (
                    <DropdownMenuItem
                      onClick={(e) => {
                        setTags((tags) => [...tags, tag]);
                        setDropdownsOpen &&
                          setDropdownsOpen({
                            SERVICE: [-1, -1],
                            MATERIAL: [-1, -1],
                            LABOR: [-1, -1],
                            TAG: [-1, -1],
                          });
                        setOpen(false);
                      }}
                      key={tag.id}
                    >
                      <div
                        className="mx-4 cursor-pointer"
                        style={{
                          backgroundColor: tag.bgColor,
                          color: tag.textColor,
                        }}
                      >
                        <span> {tag.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
              </div>
            </DropdownMenuGroup>
            <FormError />
            <DropdownMenuGroup>
              {" "}
              <div>
                <div>
                  <QuickAddForm
                    onSuccess={(tag) => {
                      setTags((tags) => [...tags, tag]);
                      setDropdownsOpen &&
                        setDropdownsOpen({
                          SERVICE: [-1, -1],
                          MATERIAL: [-1, -1],
                          LABOR: [-1, -1],
                          TAG: [-1, -1],
                        });
                      setOpen(false);
                    }}
                    setPickerOpen={setPickerOpen}
                    selectedColor={selectedColor}
                  />
                </div>
                {pickerOpen && (
                  <div className="grid grid-cols-4 gap-2 p-2">
                    {INVOICE_COLORS.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedColor({
                            textColor: color.textColor,
                            bgColor: color.bgColor,
                          });
                        }}
                        style={{
                          backgroundColor: color.bgColor,
                          color: color.textColor,
                          border:
                            selectedColor?.textColor === color.textColor
                              ? `1px solid ${color.textColor}`
                              : "none",
                        }}
                        className="rounded-md p-2"
                      >
                        Aa
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
        {/* </div> */}
      </DropdownMenu>
    </div>
  );
}

function QuickAddForm({
  onSuccess,
  setPickerOpen,
  selectedColor,
}: {
  onSuccess?: (value: Tag) => void;
  setPickerOpen: any;
  selectedColor: SelectedColor;
}) {
  const { showError } = useFormErrorStore();
  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;

    const res = await newTag({ name, ...selectedColor });

    if (res.type === "error") {
      console.log(res);
      showError({
        field: res.field || "name",
        message: res.message || "",
      });
    } else {
      useListsStore.setState(({ tags }) => ({
        tags: [...tags, res.data],
      }));
      formRef.current?.reset();
      onSuccess?.(res.data);
    }
  }

  return (
    <div>
      {" "}
      <form ref={formRef} className="flex gap-2 p-2">
        <span>
          {" "}
          <input
            name="name"
            type="text"
            required
            className="flex-1 rounded-sm border border-solid border-black p-1"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </span>

        <button
          className="rounded bg-[#6470FF] p-2 text-white"
          onClick={() => setPickerOpen((prev: boolean) => !prev)}
          type="button"
        >
          <PiPaletteBold />
        </button>

        <Submit
          className="rounded bg-slate-500 p-1 text-xs leading-3 text-white"
          formAction={handleSubmit}
        >
          Quick
          <br /> Add
        </Submit>
      </form>
    </div>
  );
}
