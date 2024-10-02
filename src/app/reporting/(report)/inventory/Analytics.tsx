"use client";
import RevenueBarChartContainer from "../revenue/chart/RevenueBarChartContainer";
import RevenueLineChartContainer from "../revenue/chart/RevenueLineChartContainer";
import ChartNavigateButtons from "./ChartNavigateButtons";
type TProps = {
  leftChart: string;
  rightChart: string;
};
export default function Analytics({ leftChart, rightChart }: TProps) {
  const days = Array.from({ length: 31 }, (_, i) => {
    return { day: `Day ${i + 1}`, profit: Math.floor(Math.random() * 1000) };
  });
  return (
    <div className="rounded-lg border p-6">
      <h1 className="py-4 text-4xl font-bold">Analytics</h1>
      <div className="mx-10 grid grid-cols-2 space-x-20">
        <div className="">
          <div className="my-5 flex justify-end">
            <ChartNavigateButtons
              key={1}
              buttonsValue={["Sales", "Purchases", "ROI"]}
              queryName="leftChart"
              chartDirectionValue={leftChart}
            />
          </div>
          <RevenueBarChartContainer />
        </div>
        <div>
          <div className="my-5 flex justify-end">
            <ChartNavigateButtons
              key={2}
              buttonsValue={["Sales", "Purchases"]}
              queryName="rightChart"
              chartDirectionValue={rightChart}
            />
          </div>
          <RevenueLineChartContainer days={days} />
        </div>
      </div>
    </div>
  );
}
