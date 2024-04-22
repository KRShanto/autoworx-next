"use client";

import type { Vehicle } from "@prisma/client";
import { useInvoiceStore } from "../../stores/invoice";
import { usePopupStore } from "../../stores/popup";
import { FaPlus } from "react-icons/fa";

export default function Vehicle({ vehicles }: { vehicles: Vehicle[] }) {
  const { open } = usePopupStore();
  const { vehicle, setVehicle } = useInvoiceStore();

  return (
    <div className="app-shadow vehicle h-[37%] w-full rounded-xl p-3">
      <div className="form-head flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase text-black">
          Vehicle details
        </h2>
        <button
          className="rounded-md bg-[#4DB6AC] px-7 py-2 text-xs text-white"
          onClick={() => open("ADD_VEHICLE", { vehicles })}
        >
          <FaPlus />
        </button>
      </div>

      <form className="form mt-5 flex flex-row gap-3">
        <div className="form-divide flex w-[30%] flex-col gap-4 text-sm text-black">
          <label htmlFor="sales-person">Year:</label>
          <label htmlFor="invoice">Make:</label>
          <label htmlFor="date">Model:</label>
          <label htmlFor="name">VIN:</label>
          <label htmlFor="mobile">License Plate:</label>
        </div>

        <div className="form-divide-input flex w-[70%] flex-col gap-3">
          <input
            type="number"
            id="year"
            name="year"
            required
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={vehicle.year}
            onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
          />
          <input
            type="text"
            id="make"
            name="make"
            required
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={vehicle.make}
            onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
          />
          <input
            type="text"
            id="model"
            name="model"
            required
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={vehicle.model}
            onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
          />
          <input
            type="text"
            id="vin"
            name="vin"
            required
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={vehicle.vin}
            onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value })}
          />
          <input
            type="text"
            id="license"
            name="license"
            required
            className="app-shadow rounded-md border-none p-1 px-3 text-xs text-black"
            value={vehicle.license}
            onChange={(e) =>
              setVehicle({ ...vehicle, license: e.target.value })
            }
          />
        </div>
      </form>
    </div>
  );
}
