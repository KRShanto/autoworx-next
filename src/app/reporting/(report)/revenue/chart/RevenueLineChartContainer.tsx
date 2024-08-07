"use client";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    month: "Jan",
    leads: 600,
  },
  {
    month: "Feb",
    leads: 200,
  },
  {
    month: "Mar",
    leads: 400,
  },
  {
    month: "Apr",
    leads: 200,
  },
  {
    month: "May",
    leads: 800,
  },
  {
    month: "May",
    leads: 300,
  },
  {
    month: "May",
    leads: 900,
  },
];
export default function RevenueLineChartContainer() {
  return (
    <div className="chart-container border-none">
      <div style={{ width: "100%" }}>
        <ResponsiveContainer width="95%" height={500}>
          <LineChart data={data}>
            <XAxis tick={false} dataKey="month">
              <Label
                angle={-360}
                value="Number of Jobs"
                position="insideBottomRight"
                style={{
                  textAnchor: "end",
                  fontWeight: "bold",
                }}
              >
                Day
              </Label>
            </XAxis>
            <YAxis
              dataKey="leads"
              stroke="#fffff"
              tickCount={8}
              domain={[0, "dataMax"]}
            />
            <Tooltip />
            <CartesianGrid
              stroke="#9ca3af"
              verticalCoordinatesGenerator={() => []}
            />
            <Line
              dataKey="leads"
              stroke="#03A7A2"
              strokeWidth="4px"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
