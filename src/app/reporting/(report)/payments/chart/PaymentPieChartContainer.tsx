"use client";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Payment Paid", value: 1300 },
  { name: "Payment Overdue", value: 300 },
];

const COLORS = ["#03A7A2", "#7BEADF"];
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { payload: data } = payload[0];
    return (
      <div className="w-56 rounded-lg border border-black bg-white p-4 text-[#03A7A2]">
        <p className="text-xl">{data?.name}</p>
        <p className="text-2xl">${data?.value}</p>
      </div>
    );
  }

  return null;
};
export default function PaymentPieChartContainer() {
  return (
    <div className="chart-container grid grid-cols-2 items-center">
      <ResponsiveContainer width="70%" height="100%">
        <PieChart width={600} height={600}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={160}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={
                  index === data.length - 1
                    ? {
                        scale: "1.1",
                        transform: "translate(-22px, -24px)",
                      }
                    : {}
                }
              />
            ))}
          </Pie>
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={<CustomTooltip />}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-10">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-md bg-[#03A7A2]"></div>
          <p className="text-lg font-bold">Payment Paid</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-md bg-[#7BEADF]"></div>
          <p className="text-lg font-bold">Payment Overdue</p>
        </div>
      </div>
    </div>
  );
}
