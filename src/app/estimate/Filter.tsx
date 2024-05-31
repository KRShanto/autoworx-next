"use client";

import FilterImage from "@/../public/icons/Filter.svg";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { cn } from "@/lib/cn";
import { useListsStore } from "@/stores/lists";
import { Status } from "@prisma/client";
import { matchSorter } from "match-sorter";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass, HiOutlineFunnel } from "react-icons/hi2";

export function Filter() {
  const searchParams = useSearchParams();
  const today = useMemo(() => moment().format(moment.HTML5_FMT.DATE), []);
  const [start, setStart] = useState(searchParams.get("start") ?? "");
  const [statusSearch, setStatusSearch] = useState(
    searchParams.get("start") ?? "",
  );
  const allStatuses = useListsStore((x) => x.statuses);
  const searchedStatuses = useMemo(
    () =>
      statusSearch
        ? matchSorter(allStatuses, statusSearch, { keys: ["name"] })
        : allStatuses,
    [allStatuses, statusSearch],
  );
  const paramStatus = +(searchParams.get("status") ?? "");
  const [status, setStatus] = useState<Status | null>(
    allStatuses.find((x) => x.id === paramStatus) ?? null,
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex h-10 items-center gap-2 rounded-md border-2 border-slate-400 p-1">
        <Image
          src={FilterImage}
          alt="Filter"
          width={20}
          height={20}
          className="cursor-pointer"
        />
        Customize
      </DialogTrigger>
      <DialogContent form>
        <DialogHeader>
          <DialogTitle>Customize</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-8">
          <SlimInput
            name="startDate"
            label="Start Date"
            type="date"
            value={start}
            onChange={(event) => setStart(event.currentTarget.value)}
            required={false}
          />
          <SlimInput
            name="endDate"
            label="End Date"
            type="date"
            defaultValue={searchParams.get("endDate") ?? ""}
            min={start}
            max={today}
            required={false}
          />
          <div className="col-span-full">
            <label className="mb-1 px-2 font-medium">Status</label>
            <div className="relative rounded border border-solid border-slate-500 p-2">
              <HiMagnifyingGlass className="absolute m-2" />
              <input
                type="search"
                value={statusSearch}
                onChange={(event) => setStatusSearch(event.currentTarget.value)}
                className={cn(slimInputClassName, "w-1/2 ps-8")}
              />
              {status && (
                <button
                  type="button"
                  className="mx-2 my-1 rounded px-2"
                  style={{
                    color: status.textColor,
                    backgroundColor: status.bgColor,
                  }}
                  onClick={() => {
                    setStatus(null);
                  }}
                >
                  {status.name}
                </button>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {searchedStatuses.map((x) => (
                  <button
                    type="button"
                    key={x.id}
                    className="rounded px-2"
                    style={{ color: x.textColor, backgroundColor: x.bgColor }}
                    onClick={() => {
                      setStatus(x);
                    }}
                  >
                    {x.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Submit
            className="mx-auto flex items-center gap-2 rounded-md bg-[#6571FF] px-4 py-1 text-white"
            formAction={async (formData) => {
              const end = formData.get("endDate");
              const params = new URLSearchParams();
              start && params.set("startDate", start);
              typeof end === "string" && params.set("endDate", end);
              status && params.set("status", status.id.toString());
              router.push(`?${params}`);
              setOpen(false);
            }}
          >
            <HiOutlineFunnel />
            Filter
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
