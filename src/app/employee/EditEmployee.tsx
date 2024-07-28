"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import NewVendor from "@/components/Lists/NewVendor";
import SelectCategory from "@/components/Lists/SelectCategory";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useListsStore } from "@/stores/lists";
import { Category, InventoryProductType, Vendor } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { RiEditFill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";

import SelectEmployeeType from "./SelectEmployeeType";

export default function EditEmployee() {
  const [open, setOpen] = useState(false);
  const [employeeTypeOpen, setEmployeeTypeOpen] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="text-[#6571FF]">
            <RiEditFill />
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
          form
        >
          <div className="mt-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Employee</h1>
            <button
              onClick={() => {
                profilePicRef.current?.click();
              }}
              className="flex items-center justify-center gap-x-2 rounded-full border border-slate-400 pl-2"
            >
              <span>Upload a profile picture</span> <RxAvatar size={48} />
            </button>
            <input
              ref={profilePicRef}
              type="file"
              name="profilePicture"
              hidden
              accept="image/*"
            />
          </div>

          <FormError />

          <div className="space-y-2 overflow-y-auto">
            <div className="flex items-center justify-between">
              <SlimInput name="firstName" />
              <SlimInput name="lastName" />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput name="email" />
              <SlimInput name="mobileNumber" />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput rootClassName="flex-1" name="address" />
            </div>
            <div className="flex items-center justify-between gap-x-2">
              <SlimInput name="city" />
              <SlimInput name="state" />
              <SlimInput name="zip" />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput name="companyName" />
              <SlimInput name="commission%" />
            </div>
            <div className="flex items-center justify-between gap-x-4">
              <SelectEmployeeType
                employeeTypeOpen={employeeTypeOpen}
                setEmployeeTypeOpen={setEmployeeTypeOpen}
              />
              <SlimInput
                name="date"
                label="Time"
                rootClassName="grow"
                type="date"
                value={""}
                required={false}
                onChange={(event) => {}}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
              Cancel
            </DialogClose>
            <Submit
              className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
              // formAction={handleSubmit}
            >
              Add
            </Submit>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
