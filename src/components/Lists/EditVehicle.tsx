"use client";

import { addVehicleColor } from "@/actions/vehicle/addVehicleColor";
import { editVehicle } from "@/actions/vehicle/editVehicle";
import { getVehicleColors } from "@/actions/vehicle/getVehicleColor";
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
import { Vehicle, VehicleColor } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPen, FaTimes } from "react-icons/fa";
import { addVehicle } from "../../actions/vehicle/addVehicle";
import Selector from "../Selector";

export default function EditVehicle({
  vehicle,
}: {
  vehicle: Vehicle & { color?: VehicleColor | undefined };
}) {
  const [open, setOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const { showError, clearError } = useFormErrorStore();

  const [colors, setColors] = useState<VehicleColor[]>([]);
  const [selectedColor, setSelectedColor] = useState<VehicleColor | null>(
    vehicle?.color ? vehicle.color : null,
  );

  // const pathname = usePathname();
  // const search = useSearchParams();

  async function getColors() {
    const res = await getVehicleColors();
    if (res.type === "success") {
      setColors(res.data);
    } else {
      console.log(res);
    }
  }

  useEffect(() => {
    getColors();
  }, []);

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

    if (!vehicle?.clientId) return;

    const res = await editVehicle({
      year,
      make,
      model,
      submodel,
      type,
      colorId: selectedColor?.id,
      transmission,
      engineSize,
      license,
      vin,
      notes,
      clientId: vehicle.clientId,
      vehicleId: vehicle.id,
    });

    if (res.type === "globalError") {
      console.log(res);
      showError({
        field: res.field,
        message:
          res.errorSource && res.errorSource?.length > 0
            ? res.errorSource[0].message
            : res.message,
      });
    } else if (res.type === "success") {
      setOpen(false);
      clearError();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          <FaPen />
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 overflow-y-auto sm:grid-cols-2">
          <FormError />

          <SlimInput
            name="year"
            type="number"
            defaultValue={vehicle?.year || ""}
          />
          <SlimInput name="make" defaultValue={vehicle?.make || ""} />
          <SlimInput name="model" defaultValue={vehicle?.model || ""} />
          <SlimInput
            name="submodel"
            defaultValue={vehicle?.submodel || ""}
            required={false}
            label="Sub Model"
          />
          <SlimInput
            name="type"
            defaultValue={vehicle?.type || ""}
            required={false}
          />

          <div>
            <label className="mb-1 px-2 font-medium">Color</label>
            <Selector
              label={(color: VehicleColor | null) => (color ? color.name : "")}
              items={colors}
              displayList={(color: VehicleColor) => <p>{color.name}</p>}
              newButton={
                <NewVehicleColor
                  setColors={setColors}
                  setColor={setSelectedColor}
                  setColorOpen={setColorOpen}
                />
              }
              selectedItem={selectedColor}
              setSelectedItem={setSelectedColor}
              openState={[colorOpen, setColorOpen]}
            />
          </div>

          <SlimInput
            name="transmission"
            defaultValue={vehicle?.transmission || ""}
            required={false}
          />
          <SlimInput
            name="engineSize"
            defaultValue={vehicle?.engineSize || ""}
            required={false}
          />
          <SlimInput
            name="license"
            defaultValue={vehicle?.license || ""}
            required={false}
            label="License Plate"
          />
          <SlimInput
            name="vin"
            defaultValue={vehicle?.vin || ""}
            required={false}
          />
          <SlimInput
            name="notes"
            defaultValue={vehicle?.notes || ""}
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
            Update
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewVehicleColor({
  setColors,
  setColor,
  setColorOpen,
}: {
  setColors: React.Dispatch<React.SetStateAction<VehicleColor[]>>;
  setColor: React.Dispatch<React.SetStateAction<VehicleColor | null>>;
  setColorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();

  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;

    const res = await addVehicleColor(name);

    if (res.type === "error") {
      console.log(res);
      showError({
        field: res.field || "name",
        message: res.message || "",
      });
    } else {
      setColors((colors) => [...colors, res.data]);
      setOpen(false);
      setColor(res.data);
      setColorOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + New Color
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md grid-rows-[auto,1fr,auto]" form>
        <DialogHeader>
          <DialogTitle>Create Color</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2">
          <FormError />

          <SlimInput name="name" label={""} />
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
