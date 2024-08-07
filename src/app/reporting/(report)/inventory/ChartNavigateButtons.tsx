"use client";

import { cn } from "@/lib/cn";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

type TProps = {
  buttonsValue: string[];
  queryName: string;
  chartDirectionValue: string;
};
export default function ChartNavigateButtons({
  buttonsValue,
  queryName,
  chartDirectionValue,
}: TProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [changeChart, setChangeChart] = useState(
    chartDirectionValue || buttonsValue[0],
  );
  const searchParams = new URLSearchParams(params);
  const handleChangeChart = (v: string) => {
    let navigateChart = "";
    if (v) {
      navigateChart = v;
    } else {
      navigateChart = buttonsValue[0];
    }
    searchParams.set(queryName, navigateChart);
    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
    setChangeChart(v);
  };
  return (
    <div className="flex w-fit items-center rounded-md bg-[#03A7A2] p-0.5 text-white">
      {buttonsValue.map((value: string, index: number) => {
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
            onClick={() => handleChangeChart(value)}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
