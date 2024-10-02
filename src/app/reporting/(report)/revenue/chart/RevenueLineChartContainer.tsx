"use client";
import moment from "moment";
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

type TDays = {
  day: string;
  profit: number;
}[];

type TProps = {
  days: TDays;
};

export default function RevenueLineChartContainer({ days }: TProps) {
  return (
    <div className="chart-container border-none">
      <div style={{ width: "100%" }}>
        <ResponsiveContainer width="95%" height={500}>
          <LineChart data={days}>
            <XAxis tick={false} dataKey="day">
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
              dataKey="profit"
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
              dataKey="profit"
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
