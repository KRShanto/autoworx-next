"use client";

import { cn } from "@/lib/cn";
import { useState } from "react";

export default function ChartNavigateButtons({
  buttonsValue,
}: {
  buttonsValue: string[];
}) {
  const [changeChart, setChangeChart] = useState("Sales");
  return (
    <div className="flex w-fit items-center rounded-md bg-[#03A7A2] p-0.5 text-white">
      {buttonsValue.map((value, index) => {
        return (
          <button
            key={value}
            className={cn(
              "border-r px-3 py-2",
              changeChart === value && "bg-white text-[#03A7A2]",
              index === 0 && "rounded-bl-sm rounded-tl-sm",
              index === buttonsValue.length - 1 &&
                "rounded-br-sm rounded-tr-sm border-r-0",
            )}
            onClick={() => setChangeChart(value)}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
