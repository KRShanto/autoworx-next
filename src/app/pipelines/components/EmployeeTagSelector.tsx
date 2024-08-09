"use client";

import { INVOICE_COLORS } from "@/lib/consts";
import { useFormErrorStore } from "@/stores/form-error";
import { Tag } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { PiPaletteBold } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import FormError from "@/components/FormError";
import Submit from "@/components/Submit"; 
import newTag from "@/actions/tag/newTag";
import { getTags } from "@/actions/tag/getTags";
import { deleteTag } from "@/actions/tag/deleteTag";

type SelectedColor = { textColor: string; bgColor: string } | null;

export function EmployeeTagSelector({
  name = "tagId",
  value,
  setValue,
  open,
  setOpen,
}: {
  name?: string;
  value?: Tag;
  setValue?: (tag: Tag | undefined) => void;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const state = useState(value);
  const [tag, setTag] = setValue ? [value, setValue] : state;
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTagList, setFilteredTagList] = useState<Tag[]>(tags);
  const [search, setSearch] = useState<string>("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<SelectedColor>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredTagList(
        tags.filter((tag) =>
          tag.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setFilteredTagList(tags);
    }
  }, [search]);

  useEffect(() => {
    setFilteredTagList(tags);
  }, [tags]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchTags() {
    const res = await getTags();
    if (res.type === "success") {
      setTags(res.data);
    }
  }

  async function handleDelete(id: number) {
    const res = await deleteTag(id);

    if (res.type === "success") {
      setTags((prev: Tag[]) => {
        return prev.filter((tag) => tag.id !== id);
      });

      if (tag?.id === id) {
        setTag(undefined!);
      }

      if (setOpen) setOpen(false);
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen && setOpen(false);
    }
  };

  return (
    <>
      <input type="hidden" name={name} value={tag?.id ?? ""} />
      <DropdownMenu
        open={open}
        onOpenChange={(open) => {
          setOpen && setOpen(open);
        }}
      >
        <DropdownMenuTrigger
          
          style={{
            backgroundColor: tag?.bgColor,
            color: tag?.textColor,
            border: tag ? `1px solid ${tag.textColor}` : "",
          }}
          onClick={() => {
            setOpen && setOpen(!open);
          }}
        >
          {/* <span>{tag?.name ?? "Select Tag"}</span>
          <FaChevronDown /> */}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="start"
          sideOffset={-10}
          className="space-y-1 p-0 "
          ref={dropdownRef}
          style={{width:"70%"}}
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
                className="mx-4 flex cursor-pointer items-center justify-between rounded-full px-4"
                style={{
                  backgroundColor: tagItem?.bgColor,
                  color: tagItem?.textColor,
                  border:
                    tagItem?.id === tag?.id ? `1px solid ${tag.textColor}` : "",
                }}
              >
                <button
                  onClick={() => {
                    setTag(tagItem);
                    setOpen && setOpen(false);
                  }}
                  className="w-full text-left"
                >
                  {tagItem.name}
                </button>
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
            }}
            setTags={setTags}
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

function QuickAddForm({
  onSuccess,
  setPickerOpen,
  selectedColor,
  setTags,
}: {
  onSuccess?: (value: Tag) => void;
  setPickerOpen: any;
  selectedColor: SelectedColor;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
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
      setTags((prev: Tag[]) => {
        return [...prev, res.data];
      });
      formRef.current?.reset();
      onSuccess?.(res.data);
    }
  }

  return (
    <form ref={formRef} className="flex gap-2 p-2 w-[200px]">
      <input
        name="name"
        type="text"
        required
        className="flex-1 rounded-sm border border-solid border-black p-1 w-[80%]"
      />

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
  );
}
