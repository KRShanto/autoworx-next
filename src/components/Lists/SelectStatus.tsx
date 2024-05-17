"use client";

import newStatus from "@/app/estimate/create/actions/newStatus";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { Status } from "@prisma/client";
import Hue from "@uiw/react-color-hue";
import { useRef, useState } from "react";
import { FaChevronUp, FaSearch } from "react-icons/fa";
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

export function SelectStatus({
  name = "statusId",
  value = null,
  setValue,
}: SelectProps<Status | null>) {
  const state = useState(value);
  const [status, setStatus] = setValue ? [value, setValue] : state;
  const statusList = useListsStore((x) => x.statuses);
  const [open, setOpen] = useState(false);

  return (
    <>
      <input type="hidden" name={name} value={status?.id ?? ""} />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          className="flex h-10 items-center gap-2 rounded-md bg-slate-100 px-2 py-1"
          style={{
            backgroundColor: `hsl(${status?.hue}, 50%, 40%)`,
            color: status?.hue !== undefined ? "#FFFFFF" : undefined,
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
          <div className="h-[140px] space-y-1 overflow-y-auto">
            {statusList.map((status) => (
              <DropdownMenuItem
                key={status.id}
                onClick={() => setStatus(status)}
                className="mx-4"
                style={{
                  backgroundColor: `hsl(${status?.hue}, 100%, 80%)`,
                  color: `hsl(${status?.hue}, 100%, 20%)`,
                }}
              >
                {status.name}
              </DropdownMenuItem>
            ))}
          </div>
          <FormError />
          <QuickAddForm
            onSuccess={(status) => {
              setStatus(status);
              setOpen(false);
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function QuickAddForm({ onSuccess }: { onSuccess?: (value: Status) => void }) {
  const n = useListsStore((x) => x.statuses.length);
  const [hue, setHue] = useState((n % 12) * 30);
  const { showError } = useFormErrorStore();
  const formRef = useRef<HTMLFormElement | null>(null);
  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;

    const res = await newStatus({ name, hue });

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
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded bg-[#6470FF] p-2 text-white">
          <PiPaletteBold />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Hue hue={hue} onChange={({ h }) => setHue(h)} />
        </DropdownMenuContent>
      </DropdownMenu>
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
