"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/Dialog";
import { usePopupStore } from "@/stores/popup";
import { useCallback } from "react";
import { TbBell, TbCalendar } from "react-icons/tb";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import type { TaskType, User } from "@prisma/client";
import Image from "next/image";
import Submit from "@/components/Submit";
import { addTask } from "../../add";
import { useFormErrorStore } from "@/stores/form-error";
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function NewAppointment() {
  const { popup, open, close } = usePopupStore();
  const setOpen = useCallback(
    (value: boolean) => {
      value ? open("ADD_TASK") : close();
    },
    [open, close],
  );

  return (
    <Dialog open={popup === "ADD_TASK"} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="app-shadow rounded-md bg-[#6571FF] p-2 text-white"
        >
          New Appointment
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-full max-w-3xl grid-rows-[auto,1fr,auto]">
        <DialogHeader>
          <div className="grid grid-cols-2 items-center">
            <DialogTitle>New Appointment</DialogTitle>
            <div className="flex items-center justify-self-center rounded-full bg-primary p-1">
              <button
                type="button"
                className="rounded-full bg-background px-4 py-1 font-semibold"
              >
                <TbCalendar className="mr-2 inline" size={24} />
                Schedule
              </button>
              <button
                type="button"
                className="rounded-full px-4 py-1 font-semibold"
              >
                <TbBell className="mr-2 inline" size={24} />
                Reminder
              </button>
            </div>
          </div>
        </DialogHeader>
        <div className="-mx-6 grid grid-cols-2 gap-px overflow-y-auto border-y border-solid bg-border">
          <div className="space-y-4 bg-background p-6">
            <FormError />
            <SlimInput name="title" label="Appointment Title" />
            <div className="flex items-end">
              <SlimInput name="date" label="Time" />
            </div>
            <div className="flex items-center">
              <input
                checked
                id="all-day"
                type="checkbox"
                value=""
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                name="all-day"
              />
              <label
                htmlFor="all-day"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                All day
              </label>
            </div>
            <button type="button" className="text-indigo-500">
              + Assign sales person
            </button>
          </div>
          <div className="relative row-span-2 bg-background p-6">
            <div className="absolute inset-0 divide-y overflow-y-auto">
              <div className="sticky top-0 flex items-center gap-4  bg-background px-8 py-2">
                <button type="button">
                  <FaChevronLeft />
                </button>
                <div className="mx-auto text-center text-primary-foreground">
                  Sunday, April 21
                </div>
                <button type="button">
                  <FaChevronRight />
                </button>
              </div>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-end flex h-24">
                  <div>{i % 12 || 12}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 bg-background p-6">
            <select className={slimInputClassName} name="client">
              <option disabled selected>
                Client
              </option>
            </select>
            <select className={slimInputClassName} name="vehicle">
              <option disabled selected>
                Vehicle
              </option>
            </select>
            <select className={slimInputClassName} name="order">
              <option disabled selected>
                Order
              </option>
            </select>
            <textarea
              name="notes"
              placeholder="Notes"
              className={slimInputClassName}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <button type="button" className="border px-4 py-1">
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            className="border bg-[#6571FF] px-4 py-1 text-white"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
