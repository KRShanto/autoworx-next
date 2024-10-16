"use client";
import {
  DialogClose,
  DialogContent,
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
        <DialogContent>
          <div className="space-y-3 rounded-md bg-white">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
