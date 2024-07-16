"use client";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  InterceptedDialog,
} from "@/components/Dialog";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { SelectStatus } from "../../components/Lists/SelectStatus";
import { useState } from "react";
export default function CreateAndEditLabor({ laborId }: { laborId?: string }) {
  const [statusOpenDropdown, setStatusOpenDropdown] = useState(true);
  return (
    <InterceptedDialog>
      <DialogContent>
        <div className="grid grid-cols-3 gap-4">
          {/* Assigned by */}
          <div>
            <label>Assigned by</label>

            {/* <Selector
              label={(vendor: Vendor | null) =>
                vendor ? vendor.name || `Vendor ${vendor.id}` : "Vendor"
              }
              newButton={
                <NewVendor
                  bgShadow={false}
                  afterSubmit={(ven) => {
                    setVendor(ven);
                    setVendorOpen(false);
                  }}
                  button={
                    <button type="button" className="text-xs text-[#6571FF]">
                      + New Vendor
                    </button>
                  }
                />
              }
              items={vendors}
              displayList={(vendor: Vendor) => <p>{vendor.name}</p>}
              onSearch={(search: string) =>
                vendors.filter((vendor) =>
                  vendor.name.toLowerCase().includes(search.toLowerCase()),
                )
              }
              openState={[vendorOpen, setVendorOpen]}
              selectedItem={vendor}
              setSelectedItem={setVendor}
            /> */}
          </div>
          <SlimInput label="Assigned Date" name="" />
          <SlimInput label="Due Date" name="" />
          <SlimInput label="Amount" name="" />
          <SlimInput label="Priority" name="" />
          <div>
            {!statusOpenDropdown && <SlimInput label="Status" name="" />}
            <SelectStatus
              open={statusOpenDropdown}
              setOpen={setStatusOpenDropdown}
            />
          </div>
        </div>
        <div>
          <label htmlFor="deposit-notes">New Note</label>
          <textarea
            name="deposit-notes"
            className="h-32 w-full resize-none rounded-md border-2 border-slate-400 p-2 outline-none"
            // defaultValue={depositNotes}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-left text-lg font-bold">Work Note</p>
            <p className="text-right text-lg font-bold">Status</p>
          </div>
          <div className="flex justify-between bg-blue-100 p-3">
            <div className="w-3/5 space-y-2">
              <p>Date: 10:00PM 5th January 2024</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Temporibus, consequuntur!
              </p>
            </div>
            <div>status</div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          {laborId ? (
            <Submit
              className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
              // formAction={handleSubmit}
            >
              Update
            </Submit>
          ) : (
            <Submit
              className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
              // formAction={handleSubmit}
            >
              Add
            </Submit>
          )}
        </DialogFooter>
      </DialogContent>
    </InterceptedDialog>
  );
}
