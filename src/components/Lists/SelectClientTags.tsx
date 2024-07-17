"use client";

import { deleteStatus } from "@/app/estimate/create/actions/deleteStatus";
import newStatus from "@/app/estimate/create/actions/newStatus";
import { INVOICE_COLORS } from "@/lib/consts";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { ClientTag } from "@/types/client";
import { Status } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowDown,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { PiPaletteBold, PiPulse } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu";
import FormError from "../FormError";
import Submit from "../Submit";
import { SelectProps } from "./select-props";

type SelectedColor = { textColor: string; bgColor: string } | null;
const Input = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <input
      type="text"
      placeholder="Search"
      className="w-full rounded-md border-2 border-slate-400 p-1 pl-6 pr-10 focus:outline-none"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
    />
  );
};

export function SelectClientTags({
  name = "tagId",
  value = null,
  setValue,
  open,
  setOpen,
}: SelectProps<any>) {
  const state = useState(value);
  const [tag, setTag] = setValue ? [value, setValue] : state;
  const [tagList, setTagList] = useState<ClientTag[]>([]);
  const [filteredTagList, setFilteredTagList] = useState<ClientTag[]>(tagList);
  const [search, setSearch] = useState<string>("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<SelectedColor>(null);
  useEffect(() => {
    if (search) {
      setFilteredTagList(
        tagList.filter((tag) =>
          tag.tag.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setFilteredTagList(tagList);
    }
  }, [search]);

  useEffect(() => {
    setFilteredTagList(tagList);
  }, [tagList]);
  async function handleDelete(id: number) {}

  return (
    <>
      <input type="hidden" name={name} value={tag?.id ?? ""} />
      <DropdownMenu
        open={open}
        onOpenChange={(open) => {
          // !open && setOpen && setOpen(open);
        }}
      >
        <DropdownMenuTrigger
          className="flex h-10 items-center gap-x-8 rounded-md bg-white px-2 py-1"
          style={{
            backgroundColor: tag?.bgColor,
            color: tag?.textColor,
          }}
          onClick={() => {
            setOpen && setOpen(!open);
          }}
        >
          <span>{tag?.tag ?? "Select Tag"}</span>
          <FaChevronDown />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="start"
          sideOffset={8}
          className="space-y-1 p-0"
        >
          {/* Search */}
          <div className="relative m-2">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
            <Input search={search} setSearch={setSearch} key="search" />
            <button
              onClick={() => {
                setOpen && setOpen(!open);
              }}
            >
              <FaChevronUp className="absolute right-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
            </button>
          </div>

          <div className="space-y-1">
            {filteredTagList.map((tagItem) => (
              <div
                key={tagItem.id}
                onClick={() => {
                  setTag(tagItem);
                  setOpen && setOpen(false);
                }}
                className="mx-4 flex cursor-pointer items-center justify-between rounded-full px-4"
                style={{
                  backgroundColor: tagItem?.bgColor,
                  color: tagItem?.textColor,
                  border:
                    tagItem?.id === tag?.id ? `1px solid ${tag.textColor}` : "",
                }}
              >
                {tagItem.tag}
                <button
                  className="text-lg text-[#66738C]"
                  onClick={() => handleDelete(tagItem.id)}
                >
                  <IoMdClose />
                </button>
              </div>
            ))}
          </div>
          <FormError />
          <QuickAddForm
            onSuccess={(tag) => {
              setTag(tag);
              if (setOpen) setOpen(false);
              // setOpen(false);
            }}
            tag={tag}
            setTag={setTag}
            tagList={tagList}
            setTagList={setTagList}
            setPickerOpen={setPickerOpen}
            selectedColor={selectedColor}
          />
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function QuickAddForm({
  onSuccess,
  setPickerOpen,
  selectedColor,
  tag,
  setTag,
  tagList,
  setTagList,
}: {
  onSuccess?: (value: Status) => void;
  setPickerOpen: any;
  selectedColor: SelectedColor;
  tag: string;
  setTag: React.Dispatch<React.SetStateAction<string>>;
  tagList: ClientTag[];
  setTagList: React.Dispatch<React.SetStateAction<ClientTag[]>>;
}) {
  async function handleSubmit() {
    setTagList([
      ...tagList,
      {
        id: tagList.length + 1,
        tag,
        bgColor: selectedColor?.bgColor || "white",
        textColor: selectedColor?.textColor || "black",
      },
    ]);
    setTag("");
  }

  return (
    <div className="flex gap-2 p-2">
      <input
        name="name"
        type="text"
        required
        className="flex-1 rounded-sm border border-solid border-black p-1"
        value={tag}
        onChange={(e) => {
          setTag(e.target.value);
        }}
      />

      <button
        className="rounded bg-[#6470FF] p-2 text-white"
        onClick={() => setPickerOpen((prev: boolean) => !prev)}
        type="button"
      >
        <PiPaletteBold />
      </button>

      <button
        className="rounded bg-slate-500 p-1 text-xs leading-3 text-white"
        onClick={handleSubmit}
      >
        Quick
        <br /> Add
      </button>
    </div>
  );
}
