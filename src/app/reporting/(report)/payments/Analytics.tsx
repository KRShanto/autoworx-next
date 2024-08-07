import RevenueBarChartContainer from "../revenue/chart/RevenueBarChartContainer";
import PaymentBarChartContainer from "./chart/PaymentBarChartContainer";
import PaymentPieChartContainer from "./chart/PaymentPieChartContainer";

export default function Analytics() {
  return (
    <div className="rounded-lg border p-6">
      <h1 className="py-4 text-4xl font-bold">Analytics</h1>
      <div className="mx-10 grid grid-cols-2 space-x-20">
        {/* bar chart */}
        <PaymentBarChartContainer />
        {/* pie chart */}
        <PaymentPieChartContainer />
      </div>
    </div>
  );
}
