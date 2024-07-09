"use client";

import { deleteStatus } from "@/app/estimate/create/actions/deleteStatus";
import newStatus from "@/app/estimate/create/actions/newStatus";
import { INVOICE_COLORS } from "@/lib/consts";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { Status } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";
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

export function SelectStatus({
  name = "statusId",
  value = null,
  setValue,
  open,
  setOpen,
}: SelectProps<Status | null>) {
  const state = useState(value);
  const [status, setStatus] = setValue ? [value, setValue] : state;
  const statusList = useListsStore((x) => x.statuses);
  // const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<SelectedColor>(null);

  useEffect(() => {
    if (status) {
      useListsStore.setState({ status });
    }
  }, [statusList]);

  async function handleDelete(id: number) {
    const res = await deleteStatus(id);

    if (res.type === "success") {
      useListsStore.setState(({ statuses }) => ({
        statuses: statuses.filter((status) => status.id !== id),
      }));
      if (status?.id === id) {
        setStatus(null);
      }
    }
  }

  return (
    <>
      <input type="hidden" name={name} value={status?.id ?? ""} />
      <DropdownMenu open={open} onOpenChange={()=>{}}>
        <DropdownMenuTrigger
          className="flex h-10 items-center gap-2 rounded-md bg-slate-100 px-2 py-1"
          style={{
            backgroundColor: status?.bgColor,
            color: status?.textColor,
          }}
          onClick={() => {
            setOpen && setOpen(!open);
          }}
        >
          <PiPulse />
          {status?.name ?? "Status"}
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
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border-2 border-slate-400 p-1 pl-6 pr-10 focus:outline-none"
            />
            <button onClick={() => setOpen(false)}>
              <FaChevronUp className="absolute right-2 top-1/2 -translate-y-1/2 transform text-[#797979]" />
            </button>
          </div>

          <div className="space-y-1">
            {statusList.map((statusItem) => (
              <DropdownMenuItem
                key={statusItem.id}
                onClick={() => setStatus(statusItem)}
                className="mx-4 flex cursor-pointer items-center justify-between"
                style={{
                  backgroundColor: statusItem?.bgColor,
                  color: statusItem?.textColor,
                  border:
                    statusItem?.id === status?.id
                      ? `1px solid ${status.textColor}`
                      : "",
                }}
              >
                {statusItem.name}
                <button
                  className="text-lg text-[#66738C]"
                  onClick={() => handleDelete(statusItem.id)}
                >
                  <IoMdClose />
                </button>
              </DropdownMenuItem>
            ))}
          </div>
          <FormError />
          <QuickAddForm
            onSuccess={(status) => {
              setStatus(status);
              setOpen(false);
            }}
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
}: {
  onSuccess?: (value: Status) => void;
  setPickerOpen: any;
  selectedColor: SelectedColor;
}) {
  const { showError } = useFormErrorStore();
  const formRef = useRef<HTMLFormElement | null>(null);
  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;

    const res = await newStatus({
      name,
      ...selectedColor,
    });

    if (res.type === "error") {
      console.log(res);
      showError({
        field: res.field || "name",
        message: res.message || "",
      });
    } else {
      useListsStore.setState(({ statuses }) => ({
        statuses: [...statuses, res.data],
      }));
      formRef.current?.reset();
      onSuccess?.(res.data);
    }
  }

  return (
    <form ref={formRef} className="flex gap-2 p-2">
      <input
        name="name"
        type="text"
        required
        className="flex-1 rounded-sm border border-solid border-black p-1"
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
