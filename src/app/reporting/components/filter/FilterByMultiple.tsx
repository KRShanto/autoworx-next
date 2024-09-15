"use client";

import { useEffect, useState } from "react";
import SliderRange from "./SliderRange";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TFilterData = {
  id: number;
  min: number;
  max: number;
  defaultValue?: [number, number];
  type: "price" | "cost" | "profit" | string;
};

type TProps = {
  filterSliders: TFilterData[];
  searchParamsValue: Record<string, string>;
};
export default function FilterByMultiple({
  filterSliders,
  searchParamsValue,
}: TProps) {
  const [show, setShow] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  const params = useSearchParams();

  const [range, setRange] = useState<
    (TFilterData & { value: number[] | null })[]
  >(filterSliders.map((filter) => ({ ...filter, value: null })));

  useEffect(() => {
    const updatedRangeFromSearchParams = range.map((rangeObj) => {
      if (searchParamsValue?.[rangeObj.type]) {
        const [min, max] = searchParamsValue[rangeObj.type]
          .split("-")
          .map(Number);
        return {
          ...rangeObj,
          value: [min, max],
        };
      }
      return rangeObj;
    });
    setRange(updatedRangeFromSearchParams);
  }, []);

  const handleValueChange = (type: string, value: [number, number]) => {
    if (type && value) {
      const updatedRange = range.map((rangeObj) => {
        if (rangeObj.type === type) {
          return {
            ...rangeObj,
            value: value,
          };
        } else {
          return rangeObj;
        }
      });
      setRange(updatedRange);
    }
  };

  const searchParams = new URLSearchParams(params);

  const handleApplyRange = () => {
    range.map((rangeObj) => {
      if (rangeObj.value) {
        searchParams.set(
          rangeObj.type,
          `${rangeObj.value[0]}-${rangeObj.value[1]}`,
        );
      }
    });
    const newPathname = `${pathname}?${searchParams.toString()}`;
    router.replace(newPathname, { scroll: false });
    setShow(false);
  };

  const handleClearAllRange = () => {
    range.map((rangeObj) => {
      if (searchParams.has(rangeObj.type)) {
        searchParams.delete(rangeObj.type);
      }
    });
    const newPathname = `${pathname}?${searchParams.toString()}`;
    router.replace(newPathname, { scroll: false });
    setShow(false);
    setRange(filterSliders.map((filter) => ({ ...filter, value: null })));
  };

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
          {range.map((slider) => (
            <SliderRange
              key={slider.id}
              onValueChange={(value) => handleValueChange(slider.type, value)}
              min={slider.min}
              max={slider.max}
              defaultValue={
                (slider.value as [number, number]) || slider.defaultValue
              }
              type={slider.type}
            />
          ))}
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={handleApplyRange}
              className="rounded-sm border px-3 py-2"
            >
              Apply
            </button>
            <button
              onClick={handleClearAllRange}
              className="rounded-sm px-3 py-2"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
