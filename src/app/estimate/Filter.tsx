"use client";

// import FilterImage from "@/../public/icons/Filter.svg";
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
import { useEstimateFilterStore } from "@/stores/estimate-filter";
import { useListsStore } from "@/stores/lists";
import { Column } from "@prisma/client";
import { matchSorter } from "match-sorter";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { BiXCircle } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { HiMagnifyingGlass, HiOutlineFunnel } from "react-icons/hi2";

export function Filter() {
  const searchParams = useSearchParams();
  const today = useMemo(() => moment().format(moment.HTML5_FMT.DATE), []);
  const [start, setStart] = useState(searchParams.get("start") ?? "");
  const [end, setEnd] = useState(searchParams.get("endDate") ?? "");
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
  const [status, setStatus] = useState<Column | null>(
    allStatuses.find((x) => x.id === paramStatus) ?? null,
  );
  const [open, setOpen] = useState(false);
  const { setFilter } = useEstimateFilterStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hidden h-10 items-center gap-2 rounded-md border-2 border-slate-400 p-1 md:flex">
        <Image
          src="/icons/Filter.svg"
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
          <div>
            <label className="mb-1 px-2 font-medium">Start Date</label>
            <div className="flex">
              <input
                name="startDate"
                id="startDate"
                type="date"
                value={start}
                onChange={(event) => {
                  setStart(event.currentTarget.value);
                  setEnd(
                    moment(event.currentTarget.value)
                      .add(1, "day")
                      .format("YYYY-MM-DD"),
                  );
                }}
                className={slimInputClassName}
              />
              <button
                type="button"
                onClick={() => setStart("")}
                className="rounded-full p-2 transition-colors hover:bg-red-200 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 px-2 font-medium">End Date</label>
            <div className="flex">
              <input
                name="endDate"
                id="endDate"
                type="date"
                onChange={(event) => {
                  setEnd(event.currentTarget.value);
                }}
                value={end}
                min={start}
                // max={today}
                className={slimInputClassName}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById(
                    "endDate",
                  ) as HTMLInputElement;
                  input.value = "";
                }}
                className="rounded-full p-2 transition-colors hover:bg-red-200 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="col-span-full">
            <label className="mb-1 px-2 font-medium">Status</label>
            <div className="relative rounded border border-solid border-slate-500 p-2">
              <div className="flex items-center gap-x-2">
                <HiMagnifyingGlass className="absolute m-2" />
                <input
                  type="search"
                  value={statusSearch}
                  onChange={(event) =>
                    setStatusSearch(event.currentTarget.value)
                  }
                  className={cn(slimInputClassName, "w-1/2 ps-8")}
                />
                {status && (
                  <button
                    type="button"
                    className="mx-2 my-1 flex cursor-default items-center gap-x-1 rounded px-2"
                    style={{
                      color: status.textColor || undefined,
                      backgroundColor: status.bgColor || undefined,
                    }}
                  >
                    {status.title}

                    <BiXCircle
                      onClick={() => {
                        setStatus(null);
                      }}
                      size={18}
                      className="cursor-pointer text-red-400"
                    />
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {searchedStatuses.map((x) => (
                  <button
                    type="button"
                    key={x.id}
                    className="rounded px-2"
                    style={{
                      color: x.textColor || undefined,
                      backgroundColor: x.bgColor || undefined,
                    }}
                    onClick={() => {
                      setStatus(x);
                    }}
                  >
                    {x.title}
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
              const end = formData.get("endDate") as string;

              setFilter({
                dateRange: [
                  start ? new Date(start) : null,
                  end ? new Date(end) : null,
                ],
                status: status?.title,
              });
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
