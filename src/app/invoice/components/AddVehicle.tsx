import { useInvoiceStore } from "../../../stores/invoice";
import { usePopupStore } from "../../../stores/popup";
import { VehicleType } from "@/types/db";
import { useState } from "react";
import Popup from "@/components/Popup";
import { FaTimes } from "react-icons/fa";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import Submit from "@/components/Submit";
import { newVehicle } from "./newVehicle";
import { useFormErrorStore } from "@/stores/form-error";

export default function AddVehicle() {
  const [option, setOption] = useState<"EXISTING_VEHICLE" | "NEW_VEHICLE">(
    "EXISTING_VEHICLE",
  );
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>();
  const { close, data } = usePopupStore();
  const { setVehicle } = useInvoiceStore();
  const { showError } = useFormErrorStore();
  const vehicles = data.vehicles as VehicleType[];

  async function handleSubmit(data: FormData) {
    const make = data.get("make") as string;
    const model = data.get("model") as string;
    const year = data.get("year") as string;
    const vin = data.get("vin") as string;
    const license = data.get("license") as string;

    const error = await newVehicle({
      make,
      model,
      year: parseInt(year),
      vin,
      license,
    });

    // @ts-ignore
    if (error && error.field) {
      // @ts-ignore
      showError(error);
      return;
    } else {
      setVehicle({
        make,
        model,
        year: parseInt(year),
        vin,
        license,
      });
      close();
    }
  }

  const addVehicle = (vehicle: any) => {
    if (!vehicle) return;

    setVehicle(vehicle);
    close();
  };

  return (
    <Popup>
      <div className="w-[30rem] px-2 py-3">
        <div className="flex items-center justify-between px-3 py-1">
          <h2 className="text-xl font-bold">Add Vehicle</h2>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>

        <div className="mt-2 px-3 py-1">
          <div className="flex items-center">
            <button
              className={`w-1/2 rounded-md px-2 py-1 ${
                option === "EXISTING_VEHICLE"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 text-gray-500"
              }`}
              onClick={() => setOption("EXISTING_VEHICLE")}
            >
              Existing Vehicle
            </button>
            <button
              className={`w-1/2 rounded-md px-2 py-1 ${
                option === "NEW_VEHICLE"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 text-gray-500"
              }`}
              onClick={() => setOption("NEW_VEHICLE")}
            >
              New Vehicle
            </button>
          </div>

          {option === "EXISTING_VEHICLE" && (
            <div className="mt-2">
              <label className="block text-sm">Vehicle</label>
              <select
                className="w-full"
                onChange={(e) =>
                  setSelectedVehicle(vehicles[parseInt(e.target.value)])
                }
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle, index) => (
                  <option
                    key={index}
                    className="cursor-pointer p-2 hover:bg-slate-100"
                    value={index}
                  >
                    {vehicle.model}
                  </option>
                ))}
              </select>

              <button
                onClick={() => addVehicle(selectedVehicle)}
                className="mx-auto mt-2 block rounded-md bg-blue-500 p-2 text-white"
              >
                Save
              </button>
            </div>
          )}

          {option === "NEW_VEHICLE" && (
            <form className="mt-2">
              <FormError />

              <div className="flex flex-col space-y-2">
                <Input
                  name="make"
                  type="text"
                  placeholder="Make"
                  className="rounded-md border p-2"
                />

                <Input
                  name="model"
                  type="text"
                  placeholder="Model"
                  className="rounded-md border p-2"
                />

                <Input
                  name="year"
                  type="number"
                  placeholder="Year"
                  className="rounded-md border p-2"
                />

                <Input
                  name="vin"
                  type="text"
                  placeholder="VIN"
                  className="rounded-md border p-2"
                />

                <Input
                  name="license"
                  type="text"
                  placeholder="License Plate"
                  className="rounded-md border p-2"
                />
              </div>
              <Submit
                className="mx-auto mt-2 block rounded-md bg-blue-500 p-2 text-white"
                formAction={handleSubmit}
              >
                Save
              </Submit>
            </form>
          )}
        </div>
      </div>
    </Popup>
  );
}
