"use client";
import React from "react";
import * as Slider from "@radix-ui/react-slider";
type TProps = {
  defaultValue?: [number, number];
  type: string;
  min: number;
  max: number;
  onValueChange: (value: [number, number]) => void;
};
export default function SliderRange({
  defaultValue,
  type,
  min,
  max,
  onValueChange,
}: TProps) {
  return (
    <div>
      <p className="mb-0.5 text-sm capitalize">{type}</p>
      <div className="flex items-center gap-x-3">
        <span className="min-w-[10%]">${min}</span>
        <Slider.Root
          className="relative flex h-5 w-[180px] touch-none select-none items-center"
          defaultValue={defaultValue || [min, max]}
          onValueChange={onValueChange}
          min={min}
          max={max}
          step={1}
          minStepsBetweenThumbs={10}
        >
          <Slider.Track className="relative h-[3px] grow rounded-full bg-[#D9D9D9]">
            <Slider.Range className="absolute h-full rounded-full bg-[#66738C]" />
          </Slider.Track>
          <Slider.Thumb
            className="block h-3 w-3 cursor-pointer rounded-[10px] bg-white shadow-[0_2px_10px] focus:outline-none"
            aria-label="Volume"
          />
          <Slider.Thumb
            className="block h-3 w-3 cursor-pointer rounded-[10px] bg-white shadow-[0_2px_10px] focus:outline-none"
            aria-label="Volume2"
          />
        </Slider.Root>
        <span className="min-w-[10%]">${max}</span>
      </div>
    </div>
  );
}
