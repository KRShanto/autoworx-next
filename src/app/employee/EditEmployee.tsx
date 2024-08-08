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
import { RiEditFill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";

import SelectEmployeeType from "./SelectEmployeeType";
import { EmployeeType, User } from "@prisma/client";
import moment from "moment";
import { useServerGet } from "@/hooks/useServerGet";
import { getCompany } from "@/actions/settings/getCompany";
import { useFormErrorStore } from "@/stores/form-error";
import { updateEmployee } from "@/actions/employee/update";

export default function EditEmployee({ employee }: { employee: User }) {
  const [open, setOpen] = useState(false);
  const [employeeTypeOpen, setEmployeeTypeOpen] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const { showError } = useFormErrorStore();
  const { data: companyName } = useServerGet(getCompany);

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

    const res = await updateEmployee({
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
      type: type as EmployeeType,
      profilePicture: undefined,
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
              <SlimInput name="firstName" defaultValue={employee.firstName} />
              <SlimInput
                name="lastName"
                defaultValue={employee.lastName!}
                required={false}
              />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput name="email" defaultValue={employee.email} />
              <SlimInput name="mobileNumber" defaultValue={employee.phone!} />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput
                rootClassName="flex-1"
                name="address"
                defaultValue={employee.address!}
                required={false}
              />
            </div>
            <div className="flex items-center justify-between gap-x-2">
              <SlimInput
                name="city"
                defaultValue={employee.city!}
                required={false}
              />
              <SlimInput
                name="state"
                defaultValue={employee.state!}
                required={false}
              />
              <SlimInput
                name="zip"
                defaultValue={employee.zip!}
                required={false}
              />
            </div>
            <div className="flex items-center justify-between">
              <SlimInput
                name="companyName"
                defaultValue={employee.companyName!}
                required={false}
              />
              <SlimInput
                name="commission%"
                defaultValue={Number(employee.commission!)}
                required={false}
              />
            </div>
            <div className="flex items-center justify-between gap-x-4">
              <SelectEmployeeType
                employeeTypeOpen={employeeTypeOpen}
                setEmployeeTypeOpen={setEmployeeTypeOpen}
                defaultType={employee.employeeType}
              />
              <SlimInput
                name="date"
                label="Time"
                rootClassName="grow"
                type="date"
                required={false}
                defaultValue={moment(employee.joinDate).format("YYYY-MM-DD")}
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
              Update
            </Submit>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
