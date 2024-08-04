"use client";
import { Bar, XAxis, YAxis } from "recharts";
import BarChartComponent from "../../BarChartComponent";

const data = [
  {
    category: "Messages",
    leads: 100,
  },
  {
    category: "Email",
    leads: 200,
  },
  {
    category: "Calls",
    leads: 200,
  },
];

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect
      x={x}
      y={y - 10}
      width={width}
      height={height}
      fill={fill}
      rx={5}
      ry={5}
    />
  );
};

const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 15}
      fill="#66738C"
      textAnchor="middle"
      dy={-6}
    >
      {value}
    </text>
  );
};
export default function SalesActivityChartContainer() {
  return (
    <div className="chart-container">
      <BarChartComponent
        height={350}
        title="Opportunity Conversion Rate"
        data={data}
      >
        <XAxis tickLine={false} dataKey={"category"} />
        <YAxis tick={false} />
        <Bar
          dataKey={"leads"}
          fill="#03A7A2"
          shape={<CustomBar />}
          label={<CustomLabel />}
        />
      </BarChartComponent>
    </div>
  );
}
