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
import SelectColor from "@/components/Lists/SelectColor";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import NewColor from "./NewColor";

export interface Color {
  id: number;
  color: string;
}
export default function AddNewVehicle() {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<Color | null>(null);
  const [colors, setColors] = useState<Color[]>([
    {
      id: 1,
      color: "Red",
    },
    {
      id: 2,
      color: "Blue",
    },
    {
      id: 3,
      color: "Green",
    },
  ]);
  const [openColor, setOpenColor] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
            + New Vehicle
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
          form
        >
          <div className="mt-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Add Vehicle</h1>
          </div>

          <FormError />

          <div className="space-y-2 overflow-y-auto">
            <div className="flex items-center justify-between gap-4">
              <SlimInput name="year" />
              <SlimInput name="make" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <SlimInput name="model" />
              <SlimInput name="subModel" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <SlimInput name="type" />
              <div className="w-[15rem]">
                <p className="mb-1 font-medium">Color</p>
                <SelectColor
                  clickabled={false}
                  label={(colour) => (color ? color.color : "Color")}
                  newButton={<NewColor colors={colors} setColors={setColors} />}
                  items={colors}
                  displayList={(color: any) => (
                    <div className="flex">
                      <button
                        className="w-full text-left text-sm font-bold"
                        onClick={() => {
                          setColor(color);
                          setOpenColor(false);
                        }}
                        type="button"
                      >
                        {color.color}
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setColors((prev) => {
                              return prev.filter((c) => c.id !== color.id);
                            });
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                  selectedItem={color}
                  setSelectedItem={setColor}
                  onSearch={(search: string) => {
                    return colors.filter((color) =>
                      color.color.toLowerCase().includes(search.toLowerCase()),
                    );
                  }}
                  openState={[openColor, setOpenColor]}
                />
              </div>
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
