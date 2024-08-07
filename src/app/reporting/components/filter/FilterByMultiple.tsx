"use client";

import { useState } from "react";
import SliderRange from "./SliderRange";

type TProps = {
  filterSliders: {
    id: number;
    min: number;
    max: number;
    defaultValue?: [number, number];
    type: "price" | "cost" | "profit";
  }[];
};
export default function FilterByMultiple({ filterSliders }: TProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setShow((prev) => !prev)}
        className="flex max-w-80 items-center gap-2 rounded-sm border border-gray-400 p-1 px-5 text-sm text-gray-400 hover:border-blue-600"
      >
        <span>Filter</span>
      </button>
      {show && (
        <div className="absolute top-10 space-y-3 rounded-md border border-black bg-white p-4 hover:z-10">
          {filterSliders.map((slider) => (
            <SliderRange
              key={slider.id}
              min={slider.min}
              max={slider.max}
              defaultValue={slider.defaultValue}
              type={slider.type}
            />
          ))}
          <div className="mt-3 flex items-center space-x-2">
            <button className="rounded-sm border px-3 py-2">Apply</button>
            <button className="rounded-sm px-3 py-2">Clear All</button>
          </div>
        </div>
      )}
    </div>
  );
}
