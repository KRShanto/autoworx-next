"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import FormError from "@/components/FormError";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import SelectEmployeeType from "./SelectEmployeeType";
import { useServerGet } from "@/hooks/useServerGet";
import { getCompany } from "@/actions/settings/getCompany";
import { useFormErrorStore } from "@/stores/form-error";
import { addEmployee } from "@/actions/employee/add";
import { EmployeeType } from "@prisma/client";

export default function AddNewEmployee() {
  const [open, setOpen] = useState(false);
  const [employeeTypeOpen, setEmployeeTypeOpen] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const { data: companyName } = useServerGet(getCompany);
  const { showError } = useFormErrorStore();

  async function handleSubmit(data: FormData) {
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const email = data.get("email") as string;
    const mobileNumber = data.get("mobileNumber") as string;
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const state = data.get("state") as string;
    const zip = data.get("zip") as string;
    const commission = data.get("commission") as string;
    const date = data.get("date") as string;
    const type = data.get("type") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    const res = await addEmployee({
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      city,
      state,
      zip,
      companyName: companyName?.name,
      commission: Number(commission),
      date,
      type: (type || EmployeeType.Sales) as EmployeeType,
      profilePicture: undefined,
      password,
      confirmPassword,
    });

    if (res.type === "error") {
      showError({ field: "all", message: res.message || "An error occurred" });
      return;
    } else {
      setOpen(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
            + Add New Employee
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
          form
        >
          <div className="mt-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Add Employee</h1>

            {/* TODO */}
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
              <SlimInput name="password" type="password" />
              <SlimInput name="confirmPassword" type="password" />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput
                rootClassName="flex-1"
                name="address"
                required={false}
              />
            </div>
            <div className="flex items-center justify-between gap-x-2">
              <SlimInput name="city" required={false} />
              <SlimInput name="state" required={false} />
              <SlimInput name="zip" required={false} />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput name="companyName" defaultValue={companyName?.name} />
              <SlimInput
                name="commission"
                label="Commission %"
                required={false}
              />
            </div>
            <div className="flex items-center justify-between gap-x-4">
              <SelectEmployeeType
                employeeTypeOpen={employeeTypeOpen}
                setEmployeeTypeOpen={setEmployeeTypeOpen}
              />
              <SlimInput
                name="date"
                label="Date joined"
                rootClassName="grow"
                type="date"
                required={false}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
              Cancel
            </DialogClose>
            <Submit
              className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
              formAction={handleSubmit}
            >
              Add
            </Submit>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
