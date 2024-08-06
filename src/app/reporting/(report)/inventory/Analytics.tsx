"use client";
import RevenueBarChartContainer from "../revenue/chart/RevenueBarChartContainer";
import RevenueLineChartContainer from "../revenue/chart/RevenueLineChartContainer";
import ChartNavigateButtons from "./ChartNavigateButtons";

export default function Analytics() {
  return (
    <div className="rounded-lg border p-6">
      <h1 className="py-4 text-4xl font-bold">Analytics</h1>
      <div className="mx-10 grid grid-cols-2 space-x-20">
        <div className="">
          <div className="my-5 flex justify-end">
            <ChartNavigateButtons
              buttonsValue={["Sales", "Purchases", "ROI"]}
            />
          </div>
          <RevenueBarChartContainer />
        </div>
        <div>
          <div className="my-5 flex justify-end">
            <ChartNavigateButtons buttonsValue={["Sales", "Purchases"]} />
          </div>
          <RevenueLineChartContainer />
        </div>
      </div>
    </div>
  );
}
