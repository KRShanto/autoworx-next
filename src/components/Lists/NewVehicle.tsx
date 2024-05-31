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
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useFormErrorStore } from "@/stores/form-error";
import { useListsStore } from "@/stores/lists";
import { useState } from "react";
import { addVehicle } from "../../app/task/[type]/actions/addVehicle";
import { INVOICE_COLORS } from "@/lib/consts";
import { ColorType } from "@/types/color";

type SelectedColor = ColorType | null;

export default function NewVehicle() {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();
  const [pickerOpen, setPickerOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState<SelectedColor>(
    INVOICE_COLORS[1],
  );

  async function handleSubmit(data: FormData) {
    const year = +(data.get("year") ?? 0) as number;
    const make = data.get("make") as string;
    const model = data.get("model") as string;
    const submodel = data.get("submodel") as string;
    const type = data.get("type") as string;
    const transmission = data.get("transmission") as string;
    const engineSize = data.get("engineSize") as string;
    const license = data.get("license") as string;
    const vin = data.get("vin") as string;
    const notes = data.get("notes") as string;

    const res = await addVehicle({
      year,
      make,
      model,
      submodel,
      type,
      textColor: selectedColor?.textColor || "black",
      bgColor: selectedColor?.bgColor || "white",
      transmission,
      engineSize,
      license,
      vin,
      notes,
    });

    if (res.type === "error") {
      console.log(res);
      showError({
        field: res.field || "make",
        message: res.message || "",
      });
    } else {
      useListsStore.setState(({ vehicles }) => ({
        vehicles: [...vehicles, res.data],
        newAddedVehicle: res.data,
      }));
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + New Vehicle
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Create Vehicle</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 overflow-y-auto sm:grid-cols-2">
          <FormError />

          <SlimInput name="year" type="number" />
          <SlimInput name="make" />
          <SlimInput name="model" />
          <SlimInput name="submodel" required={false} label="Sub Model" />
          <SlimInput name="type" required={false} />
          <div>
            <label className="mb-1 px-2 font-medium">Color</label>
            <div
              style={{
                backgroundColor: selectedColor?.bgColor,
                color: selectedColor?.textColor,
                border: "1px solid #6571FF",
              }}
              onClick={() => setPickerOpen(!pickerOpen)}
              className="cursor-pointer rounded-md px-2 py-0.5"
            >
              Aa
            </div>
          </div>

          {pickerOpen && (
            <>
              <div></div>

              <div className="grid grid-cols-4 gap-2 p-2">
                {INVOICE_COLORS.map((color, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      setSelectedColor({
                        textColor: color.textColor,
                        bgColor: color.bgColor,
                      });
                    }}
                    style={{
                      backgroundColor: color.bgColor,
                      color: color.textColor,
                      border:
                        selectedColor?.textColor === color.textColor
                          ? `1px solid ${color.textColor}`
                          : "none",
                    }}
                    className="rounded-md p-2"
                  >
                    Aa
                  </button>
                ))}
              </div>
            </>
          )}
          <SlimInput name="transmission" required={false} />
          <SlimInput name="engineSize" required={false} />
          <SlimInput name="license" required={false} label="License Plate" />
          <SlimInput name="vin" required={false} />
          <SlimInput
            name="notes"
            required={false}
            rootClassName="col-span-full"
          />
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
  );
}
