"use client";
import {
  DialogClose,
  DialogContentBlank,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
} from "@/components/Dialog";
import { Dialog } from "@/components/Dialog";
import { useState } from "react";
import { HiXMark } from "react-icons/hi2";

export default function ReDoModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-full bg-[#6571FF] px-2 py-0.5 text-white"
      >
        Re-Do
      </button>
      <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <div>
          <DialogPortal>
            <DialogOverlay />
            <DialogContentBlank className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 flex max-h-full translate-x-[-50%] translate-y-[-50%] justify-center gap-4 duration-200">
              {/* content */}
              <div className="min-h-80 min-w-[500px] space-y-3 rounded-md bg-white">
                <div className="mx-10 my-5">
                  <div>
                    <h3 className="text-xl font-bold">Service 1</h3>
                    <p className="text-semibold text-base">
                      Select employee for re-do
                    </p>
                  </div>
                  <div className="mt-5 flex flex-col justify-center space-y-1">
                    <div className="flex">
                      <p className="min-w-[150px] text-center">Name</p>
                      <p>Notes</p>
                    </div>
                    <div className="space-y-3">
                      {/* input - 1 */}
                      <div className="flex items-center">
                        <label
                          htmlFor="john"
                          className="flex min-w-[150px] items-center justify-start space-x-3"
                        >
                          <input
                            className="size-4 shrink-0 accent-[#6571FF]"
                            type="checkbox"
                            name="john"
                            id="john"
                          />
                          <p id="john" className="cursor-pointer text-center">
                            John Smith
                          </p>
                        </label>
                        <input
                          className="w-full rounded-sm border border-gray-500 pl-1 focus:outline-none"
                          type="text"
                          name=""
                          id=""
                        />
                      </div>
                      {/* input - 2 */}
                      <div className="flex items-center">
                        <label
                          htmlFor="Tim Smith"
                          className="flex min-w-[150px] items-center justify-start space-x-3"
                        >
                          <input
                            className="size-4 shrink-0 accent-[#6571FF]"
                            type="checkbox"
                            name="john"
                            id="Tim Smith"
                          />
                          <p id="john" className="cursor-pointer text-center">
                            Tim Smith
                          </p>
                        </label>
                        <input
                          className="w-full rounded-sm border border-gray-500 pl-1 focus:outline-none"
                          type="text"
                          name=""
                          id=""
                        />
                      </div>
                      {/* input - 3 */}
                      <div className="flex items-center">
                        <label
                          htmlFor="Dan Smith"
                          className="flex min-w-[150px] items-center justify-start space-x-3"
                        >
                          <input
                            className="size-4 shrink-0 accent-[#6571FF]"
                            type="checkbox"
                            name="john"
                            id="Dan Smith"
                          />
                          <p id="john" className="cursor-pointer text-center">
                            Dan Smith
                          </p>
                        </label>
                        <input
                          className="w-full rounded-sm border border-gray-500 pl-1 focus:outline-none"
                          type="text"
                          name=""
                          id=""
                        />
                      </div>
                      {/* input - 4 */}
                      <div className="flex items-center">
                        <label
                          htmlFor="Harry Smith"
                          className="flex min-w-[150px] items-center justify-start space-x-3"
                        >
                          <input
                            className="size-4 shrink-0 accent-[#6571FF]"
                            type="checkbox"
                            name="john"
                            id="Harry Smith"
                          />
                          <p id="john" className="cursor-pointer text-center">
                            Harry Smith
                          </p>
                        </label>
                        <input
                          className="w-full rounded-sm border border-gray-500 pl-1 focus:outline-none"
                          type="text"
                          name=""
                          id=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="py-8">
                  <button className="mx-auto rounded bg-[#6571FF] px-8 py-2 text-white">
                    Save Changes
                  </button>
                </DialogFooter>
              </div>

              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground print:hidden">
                <HiXMark className="h-6 w-6 text-slate-500" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogContentBlank>
          </DialogPortal>
        </div>
      </Dialog>
    </>
  );
}
