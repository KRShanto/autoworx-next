import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import { SlimInput } from "@/components/SlimInput";
import { useState } from "react";

type TProps = {};

export default function EstimateModal({}: TProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-nowrap rounded-md border border-[#006D77] bg-white px-2 text-sm text-[#006D77] hover:bg-[#006D77] hover:text-white">
          Request Estimate
        </p>
      </DialogTrigger>
      <DialogContent>
        {/* {error && <p className="text-center text-sm text-red-400">{error}</p>} */}
        <h2 className="mb-5 text-2xl font-bold">Request an Invoice/Estimate</h2>
        <div className="flex flex-col justify-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SlimInput label="Vehicle Name" name="vehicleName" type="text" />
            <SlimInput label="Year" name="year" type="text" />
            <SlimInput label="Make" name="make" type="text" />
            <SlimInput label="Model" name="model" type="text" />
          </div>
          <div className="grid grid-cols-1 gap-y-2">
            <SlimInput
              label="Service Requested"
              name="vehicleName"
              type="text"
            />
            <SlimInput
              className="w-2/4"
              label="Due Date"
              name="dueDate"
              type="date"
            />
            <label className={"block"}>
              <div className="mb-1 px-2 font-medium">Notes</div>
              <textarea
                name=""
                id=""
                className="h-[93px] w-full resize-none rounded-md border border-gray-500 px-2 focus:outline-none"
              ></textarea>
            </label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white">
            Add
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
